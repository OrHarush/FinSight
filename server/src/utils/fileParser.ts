import * as XLSX from 'xlsx';

import { ApiError } from '../errors/ApiError';

type CellValue = string | number | boolean | null | undefined;
type RawRow = CellValue[];

interface ColumnMap {
  dateIdx: number;
  nameIdx: number;
  amountIdx: number;
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
}

export interface ParseResult {
  rows: ParsedRow[];
  warnings: string[];
}

type FieldKey = 'date' | 'name' | 'amount';

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
};

const NORMALIZED_FIELD_SYNONYMS: Record<FieldKey, Synonym[]> = {
  date: FIELD_SYNONYMS.date.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  name: FIELD_SYNONYMS.name.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
  amount: FIELD_SYNONYMS.amount.map(({ s, w }) => ({ s: normalizeHeader(s), w })),
};

const FIELD_THRESHOLDS: Record<FieldKey, number> = {
  date: 8,
  amount: 8,
  name: 6,
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

  if (date.score < FIELD_THRESHOLDS.date || amount.score < FIELD_THRESHOLDS.amount) {
    return null;
  }

  if (date.idx === amount.idx) {
    return null;
  }

  const nameResolved = name.score >= FIELD_THRESHOLDS.name && name.idx !== date.idx && name.idx !== amount.idx;

  return {
    cols: {
      dateIdx: date.idx,
      amountIdx: amount.idx,
      nameIdx: nameResolved ? name.idx : -1,
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

    const rawDate = row[cols.dateIdx];
    const rawAmount = row[cols.amountIdx];

    const date = parseDate(rawDate);
    const amount = parseAmount(rawAmount);

    if (date === null && amount === null) {
      continue;
    }

    if (date === null || amount === null) {
      failCount++;
      continue;
    }

    const rawName = cols.nameIdx === -1 ? '' : row[cols.nameIdx];
    const name = rawName == null ? '' : String(rawName).trim();

    rows.push({ date, name, amount });
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
  let anySheetDetected = false;
  let anyNameMissing = false;

  for (const sheetRows of nonEmptySheets) {
    const header = findHeaderRow(sheetRows);

    if (!header) {
      continue;
    }

    anySheetDetected = true;

    const { rows, failCount, nameMissing } = extractRowsFromSheet(sheetRows, header);

    allRows.push(...rows);
    totalFail += failCount;

    if (nameMissing) {
      anyNameMissing = true;
    }
  }

  if (!anySheetDetected) {
    throw ApiError.badRequest(
      'Could not detect column headers. Expected columns: date, name/merchant, amount.'
    );
  }

  if (anyNameMissing) {
    warnings.push('Name/description column not found — name will be empty for some rows.');
  }

  if (totalFail > 0) {
    warnings.push(`Could not parse ${totalFail} row(s).`);
  }

  return { rows: allRows, warnings };
};
