import * as XLSX from 'xlsx';

import { ApiError } from '../errors/ApiError';

type CellValue = string | number | boolean | Date | null | undefined;
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
  // Use Date.UTC to avoid local-timezone offset shifting the date
  const d = new Date(Date.UTC(year, month - 1, day));

  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

const parseDate = (value: CellValue): string | null => {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return null;
    }

    // Use local getters — SheetJS cellDates:true emits dates in local time
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
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

    // DD/MM/YYYY or DD.MM.YYYY (Israeli standard, Amex uses dots + 4-digit year)
    const ddmmyyyy = trimmed.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})$/);

    if (ddmmyyyy) {
      return toIsoDateString(
        parseInt(ddmmyyyy[3], 10),
        parseInt(ddmmyyyy[2], 10),
        parseInt(ddmmyyyy[1], 10)
      );
    }

    // DD/MM/YY or DD.MM.YY (2-digit year — Amex Israel billing export e.g. "31.12.25")
    const ddmmyy = trimmed.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{2})$/);

    if (ddmmyy) {
      // Credit card transactions are always from 2000+
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

const ALLOWED_MIMETYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/csv',
  'text/plain',
];

export const parseFile = (buffer: Buffer, mimetype: string): ParseResult => {
  if (!ALLOWED_MIMETYPES.includes(mimetype)) {
    throw ApiError.badRequest(
      `Unsupported file type: ${mimetype}. Only xlsx and csv files are accepted.`
    );
  }

  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<RawRow>(sheet, {
    header: 1,
    defval: null,
  });

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
