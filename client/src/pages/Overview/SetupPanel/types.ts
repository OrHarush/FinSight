export interface QuickAddPreset {
  type: 'Income' | 'Expense';
  name: string;
  amount?: number;
}
