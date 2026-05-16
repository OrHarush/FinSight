export const UNKNOWN_CARD_KEY = '__unknown__';
export const SINGLE_CARD_KEY = '__single__';

export type FileFormat = 'credit-card' | 'bank-statement';

export interface ParsedRow {
  date: string;
  name: string;
  amount: number;
  card: string | null;
}

export interface ImportPreview {
  rowCount: number;
  dateRange: { from: string; to: string } | null;
  rows: ParsedRow[];
  sample: ParsedRow[];
  warnings: string[];
  cards: string[];
  cardCounts: Record<string, number>;
  format: FileFormat;
}

export interface WizardRow extends Omit<ParsedRow, 'card'> {
  selected: boolean;
  categoryId: string | null;
  card: string;
}

export interface WizardSettings {
  accountId: string;
  cardAssignments: Record<string, string>;
  dateFilter: { from: string; to: string } | null;
}
