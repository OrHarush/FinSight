import * as XLSX from 'xlsx';

import { ApiError } from '../errors/ApiError';

type CellValue = string | number | boolean | null | undefined;
type RawRow = CellValue[];

export type FileFormat = 'credit-card' | 'bank-statement';

interface ColumnMap {
  dateIdx: number;
  nameIdx: number;
  amountIdx: number;
  cardIdx: number;
  debitIdx: number;
  creditIdx: number;
  signedAmountIdx: number;
  format: FileFormat;
}

interface DetectedHeader {
  index: number;
  cols: ColumnMap;
  nameMissing: boolean;
}

export interface ParsedRow {
  date: string;
  name: string;
  amount: number;
  card: string | null;
}

export interface ParseResult {
  rows: ParsedRow[];
  warnings: string[];
  format: FileFormat;
}

type FieldKey = 'date' | 'name' | 'amount' | 'card' | 'debit' | 'credit';

interface Synonym {
  s: string;
  w: number;
}

const CSV_MIMETYPES = ['text/csv', 'application/csv', 'text/plain'];
const XLSX_MIMETYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ALLOWED_MIMETYPES = [...CSV_MIMETYPES, ...XLSX_MIMETYPES];

const normalizeHeader = (cell: CellValue): string => {
  if (cell == null) {
    return '';
  }

  const stripped = String(cell)
    .replace(/[\u200e\u200f\u202a-\u202e]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (stripped === '') {
    return '';
  }

  return stripped
    .split(' ')
    .map(token => (token.length >= 3 && token.startsWith('ה') ? token.slice(1) : token))
    .join(' ');
};

const FIELD_SYNONYMS: Record<FieldKey, Synonym[]> = {
  date: [
    { s: 'תאריך עסקה', w: 10 },
    { s: 'תאריך רכישה', w: 10 },
    { s: 'transaction date', w: 10 },
    { s: 'purchase date', w: 10 },
    { s: 'תאריך חיוב', w: 4 },
    { s: 'billing date', w: 4 },
    { s: 'posting date', w: 4 },
    { s: 'תאריך', w: 6 },
    { s: 'date', w: 6 },
  ],
  name: [
    { s: 'שם בית עסק', w: 10 },
    { s: 'בית עסק', w: 10 },
    { s: 'merchant name', w: 10 },
    { s: 'merchant', w: 10 },
    { s: 'description', w: 8 },
    { s: 'תיאור', w: 8 },
    { s: 'פעולה', w: 8 },
    { s: 'payee', w: 8 },
    { s: 'vendor', w: 8 },
    { s: 'details', w: 6 },
  ],
  amount: [
    { s: 'סכום חיוב', w: 10 },
    { s: 'billing amount', w: 10 },
    { s: 'charge amount', w: 10 },
    { s: 'amount charged', w: 10 },
    { s: 'סכום עסקה מקורי', w: 3 },
    { s: 'סכום עסקה', w: 4 },
    { s: 'original amount', w: 3 },
    { s: 'transaction amount', w: 4 },
    { s: 'סכום', w: 5 },
    { s: 'amount', w: 5 },
    { s: 'total', w: 4 },
  ],
  card: [
    { s: "מס' כרטיס", w: 10 },
    { s: 'מספר כרטיס', w: 10 },
    { s: 'card number', w: 10 },
    { s: 'last 4 digits', w: 10 },
    { s: '4 ספרות אחרונות', w: 10 },
    { s: 'כרטיס', w: 6 },
    { s: 'card', w: 6 },
  ],
  debit: [
    { s: 'חובה', w: 10 },
    { s: 'תשלום', w: 6 },
    { s: 'debit', w: 10 },
    { s: 'withdrawal', w: 8 },
    { s: 'יציאה', w: 6 },
  ],
  credit: [
    { s: 'זכות', w: 10 },
    { s: 'הפקדה', w: 6 },
    { s: 'credit', w: 10 },
    { s: 'deposit', w: 8 },
    { s: 'כניסה', w: 6 },
  ],
};

const NORMALIZED_FIELD_SYNONYMS: Record<FieldKey, Synonym[]> = {
  date: FIELD_SYNONYMS.date.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  name: FIELD_SYNONYMS.name.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  amount: FIELD_SYNONYMS.amount.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  card: FIELD_SYNONYMS.card.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  debit: FIELD_SYNONYMS.debit.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  credit: FIELD_SYNONYMS.credit.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
};

const FIELD_THRESHOLDS: Record<FieldKey, number> = {
  date: 8,
  amount: 8,
  name: 6,
  card: 6,
  debit: 8,
  credit: 8,
};

const scoreCellForField = (normalized: string, field: FieldKey): number => {
  if (normalized === '') {
    return 0;
  }

  let best = 0;

  for (const { s, w } of NORMALIZED_FIELD_SYNONYMS[field]) {
    const contribution = normalized === s ? w * 2 : normalized.includes(s) ? w : 0;

    if (contribution > best) {
      best = contribution;
    }
  }

  return best;
};

const pickBestColumn = (normalizedCells: string[], field: FieldKey): { idx: number; score: number } => {
  let bestIdx = -1;
  let bestScore = 0;

  for (let i = 0; i < normalizedCells.length; i++) {
    const score = scoreCellForField(normalizedCells[i], field);

    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return { idx: bestIdx, score: bestScore };
};

const resolveColumnsForRow = (row: RawRow): { cols: ColumnMap; nameMissing: boolean } | null => {
  const normalized = row.map(normalizeHeader);

  const date = pickBestColumn(normalized, 'date');
  const amount = pickBestColumn(normalized, 'amount');
  const name = pickBestColumn(normalized, 'name');
  const card = pickBestColumn(normalized, 'card');
  const debit = pickBestColumn(normalized, 'debit');
  const credit = pickBestColumn(normalized, 'credit');

  if (date.score < FIELD_THRESHOLDS.date) {
    return null;
  }

  const bankCols =
    debit.score >= FIELD_THRESHOLDS.debit &&
    credit.score >= FIELD_THRESHOLDS.credit &&
    debit.idx !== date.idx &&
    credit.idx !== date.idx;

  if (bankCols) {
    const isSignedColumn = debit.idx === credit.idx;
    const debitIdx = isSignedColumn ? -1 : debit.idx;
    const creditIdx = isSignedColumn ? -1 : credit.idx;
    const signedAmountIdx = isSignedColumn ? debit.idx : -1;

    const nameResolved =
      name.score >= FIELD_THRESHOLDS.name &&
      name.idx !== date.idx &&
      name.idx !== debit.idx &&
      name.idx !== credit.idx;

    return {
      cols: {
        dateIdx: date.idx,
        amountIdx: -1,
        nameIdx: nameResolved ? name.idx : -1,
        cardIdx: -1,
        debitIdx,
        creditIdx,
        signedAmountIdx,
        format: 'bank-statement',
      },
      nameMissing: !nameResolved,
    };
  }

  if (amount.score < FIELD_THRESHOLDS.amount || date.idx === amount.idx) {
    return null;
  }

  const nameResolved = name.score >= FIELD_THRESHOLDS.name && name.idx !== date.idx && name.idx !== amount.idx;
  const cardResolved =
    card.score >= FIELD_THRESHOLDS.card &&
    card.idx !== date.idx &&
    card.idx !== amount.idx &&
    (!nameResolved || card.idx !== name.idx);

  return {
    cols: {
      dateIdx: date.idx,
      amountIdx: amount.idx,
      nameIdx: nameResolved ? name.idx : -1,
      cardIdx: cardResolved ? card.idx : -1,
      debitIdx: -1,
      creditIdx: -1,
      signedAmountIdx: -1,
      format: 'credit-card',
    },
    nameMissing: !nameResolved,
  };
};

const findHeaderRow = (rows: RawRow[]): DetectedHeader | null => {
  for (let i = 0; i < rows.length; i++) {
    const nonEmpty = rows[i].filter(c => c != null && String(c).trim() !== '').length;

    if (nonEmpty < 3) {
      continue;
    }

    const resolved = resolveColumnsForRow(rows[i]);

    if (resolved) {
      return { index: i, cols: resolved.cols, nameMissing: resolved.nameMissing };
    }
  }

  return null;
};

const RAW_SUMMARY_LABELS = [
  'סך הכל',
  'סה"כ',
  'סה\'כ',
  'סה״כ',
  'סה"כ לחיוב',
  'total',
  'grand total',
  'summary',
];
const SUMMARY_LABELS = RAW_SUMMARY_LABELS.map(normalizeHeader).filter(s => s !== '');

const firstNonEmptyNormalized = (row: RawRow): string => {
  for (const cell of row) {
    if (cell != null && String(cell).trim() !== '') {
      return normalizeHeader(cell);
    }
  }

  return '';
};

const isSummaryRow = (row: RawRow): boolean => {
  const first = firstNonEmptyNormalized(row);

  if (first === '') {
    return false;
  }

  return SUMMARY_LABELS.some(label => first === label || first.startsWith(`${label} `));
};

const toIsoDateString = (year: number, month: number, day: number): string | null => {
  const d = new Date(Date.UTC(year, month - 1, day));

  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

const parseDate = (value: CellValue): string | null => {
  if (typeof value === 'number' && value > 1000) {
    const d = new Date(Math.round((value - 25569) * 86400 * 1000));

    if (!isNaN(d.getTime())) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');

      return `${y}-${m}-${day}`;
    }

    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return toIsoDateString(
      parseInt(trimmed.slice(0, 4), 10),
      parseInt(trimmed.slice(5, 7), 10),
      parseInt(trimmed.slice(8, 10), 10)
    );
  }

  const ddmmyyyy = trimmed.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);

  if (ddmmyyyy) {
    return toIsoDateString(
      parseInt(ddmmyyyy[3], 10),
      parseInt(ddmmyyyy[2], 10),
      parseInt(ddmmyyyy[1], 10)
    );
  }

  const ddmmyy = trimmed.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2})$/);

  if (ddmmyy) {
    return toIsoDateString(
      2000 + parseInt(ddmmyy[3], 10),
      parseInt(ddmmyy[2], 10),
      parseInt(ddmmyy[1], 10)
    );
  }

  return null;
};

const normalizeCardValue = (value: CellValue): string | null => {
  if (value == null) {
    return null;
  }

  const raw = String(value).replace(/[‎‏‪-‮]/g, '').trim();

  if (raw === '' || raw === '-') {
    return null;
  }

  const digits = raw.replace(/\D/g, '');

  if (digits.length >= 4) {
    return digits.slice(-4);
  }

  return raw;
};

const parseAmount = (value: CellValue): number | null => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = value.replace(/[₪$,\s]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
};

const parseCSVLine = (line: string): string[] => {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  fields.push(current.trim());

  return fields;
};

const readCSV = (buffer: Buffer): RawRow[] => {
  const text = buffer.toString('utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n');

  return lines
    .map(line => parseCSVLine(line) as RawRow)
    .filter(row => row.some(cell => cell !== '' && cell != null));
};

const readXLSXSheets = (buffer: Buffer): RawRow[][] => {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });

  return workbook.SheetNames.map(name =>
    XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[name], {
      header: 1,
      defval: null,
      raw: true,
    })
  );
};

interface SheetExtraction {
  rows: ParsedRow[];
  failCount: number;
  nameMissing: boolean;
}

const extractRowsFromSheet = (rawRows: RawRow[], header: DetectedHeader): SheetExtraction => {
  const { cols, nameMissing } = header;
  const rows: ParsedRow[] = [];
  let failCount = 0;

  const dataRows = rawRows.slice(header.index + 1);

  for (const row of dataRows) {
    const allEmpty = row.every(cell => cell == null || cell === '');

    if (allEmpty) {
      continue;
    }

    if (isSummaryRow(row)) {
      continue;
    }

    const date = parseDate(row[cols.dateIdx]);

    let amount: number | null;

    if (cols.format === 'bank-statement' && cols.signedAmountIdx !== -1) {
      const signed = parseAmount(row[cols.signedAmountIdx]);

      amount = signed === null || signed === 0 ? null : -signed;
    } else if (cols.format === 'bank-statement') {
      const debit = parseAmount(row[cols.debitIdx]);
      const credit = parseAmount(row[cols.creditIdx]);
      const hasDebit = debit !== null && debit !== 0;
      const hasCredit = credit !== null && credit !== 0;

      if (hasDebit && hasCredit) {
        amount = null;
      } else if (hasDebit) {
        amount = Math.abs(debit as number);
      } else if (hasCredit) {
        amount = -Math.abs(credit as number);
      } else {
        amount = null;
      }
    } else {
      amount = parseAmount(row[cols.amountIdx]);
    }

    if (date === null && amount === null) {
      continue;
    }

    if (date === null || amount === null) {
      failCount++;
      continue;
    }

    const rawName = cols.nameIdx === -1 ? '' : row[cols.nameIdx];
    const name = rawName == null ? '' : String(rawName).trim();
    const card = cols.cardIdx === -1 ? null : normalizeCardValue(row[cols.cardIdx]);

    rows.push({ date, name, amount, card });
  }

  return { rows, failCount, nameMissing };
};

export const parseFile = (buffer: Buffer, mimetype: string): ParseResult => {
  if (!ALLOWED_MIMETYPES.includes(mimetype)) {
    throw ApiError.badRequest(
      `Unsupported file type: ${mimetype}. Only xlsx and csv files are accepted.`
    );
  }

  const sheets = CSV_MIMETYPES.includes(mimetype)
    ? [readCSV(buffer)]
    : readXLSXSheets(buffer);

  const nonEmptySheets = sheets.filter(s => s.length > 0);

  if (nonEmptySheets.length === 0) {
    throw ApiError.badRequest('File is empty or could not be read.');
  }

  const allRows: ParsedRow[] = [];
  const warnings: string[] = [];
  let totalFail = 0;
  let anyNameMissing = false;
  const detectedFormats = new Set<FileFormat>();

  for (const sheetRows of nonEmptySheets) {
    const header = findHeaderRow(sheetRows);

    if (!header) {
      continue;
    }

    detectedFormats.add(header.cols.format);

    const { rows, failCount, nameMissing } = extractRowsFromSheet(sheetRows, header);

    allRows.push(...rows);
    totalFail += failCount;

    if (nameMissing) {
      anyNameMissing = true;
    }
  }

  if (detectedFormats.size === 0) {
    throw ApiError.badRequest(
      'Could not detect column headers. Supported formats: credit-card statements (date + amount columns) and bank statements (date + debit/credit columns).'
    );
  }

  if (detectedFormats.size > 1) {
    throw ApiError.badRequest(
      'File mixes formats (credit-card and bank-statement). Each file must be a single format.'
    );
  }

  if (anyNameMissing) {
    warnings.push('Name/description column not found — name will be empty for some rows.');
  }

  if (totalFail > 0) {
    warnings.push(`Could not parse ${totalFail} row(s).`);
  }

  const format = detectedFormats.values().next().value as FileFormat;

  return { rows: allRows, warnings, format };
};
