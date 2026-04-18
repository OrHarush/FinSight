export type CellTone = 'positive' | 'negative' | 'neutral' | 'brand';

export interface ComparisonCell {
  value: string;
  tone: CellTone;
}

export interface ComparisonRowData {
  feature: string;
  lyra: ComparisonCell;
  riseup: ComparisonCell;
  excel: ComparisonCell;
}
