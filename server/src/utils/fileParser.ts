import * as XLSX from 'xlsx';

import { ApiError } from '../errors/ApiError';

type CellValue = string | number | boolean | null | undefined;
type RawRow = CellValue[];

interface ColumnMap {
  dateIdx: number;
  nameIdx: number;
  amountIdx: number;
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

const DATE_KEYWORDS = ['date', 'תאריך'];
const AMOUNT_KEYWORDS = ['amount', 'סכום', 'חיוב'];
const NAME_KEYWORDS = ['description', 'תיאור', 'שם בית עסק', 'merchant'];

const CSV_MIMETYPES = ['text/csv', 'application/csv', 'text/plain'];
const XLSX_MIMETYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ALLOWED_MIMETYPES = [...CSV_MIMETYPES, ...XLSX_MIMETYPES];

const cellMatchesGroup = (cell: CellValue, keywords: string[]): boolean => {
  if (cell == null) {
    return false;
  }

  const normalized = String(cell).toLowerCase();

  return keywords.some(kw => normalized.includes(kw));
};

const detectHeaderRow = (rows: RawRow[]): number => {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let matchCount = 0;

    if (row.some(cell => cellMatchesGroup(cell, DATE_KEYWORDS))) matchCount++;
    if (row.some(cell => cellMatchesGroup(cell, AMOUNT_KEYWORDS))) matchCount++;
    if (row.some(cell => cellMatchesGroup(cell, NAME_KEYWORDS))) matchCount++;

    if (matchCount >= 2) {
      return i;
    }
  }

  return -1;
};

const detectColumns = (headerRow: RawRow): Partial<ColumnMap> => {
  const result: Partial<ColumnMap> = {};

  headerRow.forEach((cell, idx) => {
    if (result.dateIdx === undefined && cellMatchesGroup(cell, DATE_KEYWORDS)) {
      result.dateIdx = idx;
    } else if (result.amountIdx === undefined && cellMatchesGroup(cell, AMOUNT_KEYWORDS)) {
      result.amountIdx = idx;
    } else if (result.nameIdx === undefined && cellMatchesGroup(cell, NAME_KEYWORDS)) {
      result.nameIdx = idx;
    }
  });

  return result;
};

const toIsoDateString = (year: number, month: number, day: number): string | null => {
  const d = new Date(Date.UTC(year, month - 1, day));

  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

const parseDate = (value: CellValue): string | null => {
  // Excel numeric serial (only produced by XLSX xlsx path, never by our CSV path)
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

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return toIsoDateString(
        parseInt(trimmed.slice(0, 4), 10),
        parseInt(trimmed.slice(5, 7), 10),
        parseInt(trimmed.slice(8, 10), 10)
      );
    }

    // DD/MM/YYYY or DD.MM.YYYY (4-digit year)
    const ddmmyyyy = trimmed.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})$/);

    if (ddmmyyyy) {
      return toIsoDateString(
        parseInt(ddmmyyyy[3], 10),
        parseInt(ddmmyyyy[2], 10),
        parseInt(ddmmyyyy[1], 10)
      );
    }

    // DD/MM/YY or DD.MM.YY (2-digit year — Israeli bank exports e.g. "31.12.25")
    const ddmmyy = trimmed.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{2})$/);

    if (ddmmyy) {
      return toIsoDateString(
        2000 + parseInt(ddmmyy[3], 10),
        parseInt(ddmmyy[2], 10),
        parseInt(ddmmyy[1], 10)
      );
    }
  }

  return null;
};

const parseAmount = (value: CellValue): number | null => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[₪$,\s]/g, '');
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? null : parsed;
  }

  return null;
};

const parseRow = (row: RawRow, colMap: ColumnMap): ParsedRow | null => {
  const rawDate = row[colMap.dateIdx];
  const rawAmount = row[colMap.amountIdx];
  const rawName = colMap.nameIdx === -1 ? '' : row[colMap.nameIdx];

  const date = parseDate(rawDate);
  const amount = parseAmount(rawAmount);

  if (date === null || amount === null) {
    return null;
  }

  const name = rawName == null ? '' : String(rawName).trim();

  return { date, name, amount };
};

// Minimal CSV parser that keeps all values as strings — no type coercion.
// Handles double-quoted fields and escaped quotes ("").
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

const readXLSX = (buffer: Buffer): RawRow[] => {
  // cellDates: false keeps date serials as numbers; we convert them ourselves
  // to avoid XLSX's locale-dependent date detection
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  return XLSX.utils.sheet_to_json<RawRow>(sheet, {
    header: 1,
    defval: null,
    raw: true,
  });
};

export const parseFile = (buffer: Buffer, mimetype: string): ParseResult => {
  if (!ALLOWED_MIMETYPES.includes(mimetype)) {
    throw ApiError.badRequest(
      `Unsupported file type: ${mimetype}. Only xlsx and csv files are accepted.`
    );
  }

  const rawRows = CSV_MIMETYPES.includes(mimetype)
    ? readCSV(buffer)
    : readXLSX(buffer);

  if (rawRows.length === 0) {
    throw ApiError.badRequest('File is empty or could not be read.');
  }

  const headerRowIndex = detectHeaderRow(rawRows);

  if (headerRowIndex === -1) {
    throw ApiError.badRequest(
      'Could not detect column headers. Expected columns: date, name/merchant, amount.'
    );
  }

  const colsPartial = detectColumns(rawRows[headerRowIndex]);
  const warnings: string[] = [];

  if (colsPartial.dateIdx === undefined) {
    throw ApiError.badRequest('Could not find a date column.');
  }

  if (colsPartial.amountIdx === undefined) {
    throw ApiError.badRequest('Could not find an amount column.');
  }

  if (colsPartial.nameIdx === undefined) {
    warnings.push('Name/description column not found — name will be empty.');
  }

  const colMap: ColumnMap = {
    dateIdx: colsPartial.dateIdx,
    amountIdx: colsPartial.amountIdx,
    nameIdx: colsPartial.nameIdx ?? -1,
  };

  const dataRows = rawRows
    .slice(headerRowIndex + 1)
    .filter(row => !row.every(cell => cell == null || cell === ''));

  let failCount = 0;
  const rows: ParsedRow[] = [];

  for (const row of dataRows) {
    const parsed = parseRow(row, colMap);

    if (parsed === null) {
      failCount++;
    } else {
      rows.push(parsed);
    }
  }

  if (failCount > 0) {
    warnings.push(`Could not parse ${failCount} row(s).`);
  }

  return { rows, warnings };
};
