export interface ParsedRow {
  date: string;
  name: string;
  amount: number;
}

export interface ImportPreview {
  rowCount: number;
  dateRange: { from: string; to: string } | null;
  rows: ParsedRow[];
  sample: ParsedRow[];
  warnings: string[];
}

export interface WizardRow extends ParsedRow {
  selected: boolean;
  categoryId: string | null;
}

export interface WizardSettings {
  accountId: string;
  paymentMethodId: string;
  dateFilter: { from: string; to: string } | null;
}
