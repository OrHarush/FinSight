export const RECURRING_CHIP_KEYS = ['salary', 'rent', 'mortgage', 'loan', 'subscription'] as const;
export type RecurringChipKey = (typeof RECURRING_CHIP_KEYS)[number];

export const RECURRING_CHIP_CONFIG: Record<RecurringChipKey, { type: 'Income' | 'Expense' }> = {
  salary: { type: 'Income' },
  rent: { type: 'Expense' },
  mortgage: { type: 'Expense' },
  loan: { type: 'Expense' },
  subscription: { type: 'Expense' },
};

export const VARIABLE_CHIP_KEYS = ['coffee', 'supermarket', 'fuel'] as const;
export type VariableChipKey = (typeof VARIABLE_CHIP_KEYS)[number];

export const VARIABLE_CHIP_CONFIG: Record<VariableChipKey, { type: 'Income' | 'Expense'; amount: number }> = {
  coffee: { type: 'Expense', amount: 14 },
  supermarket: { type: 'Expense', amount: 247 },
  fuel: { type: 'Expense', amount: 280 },
};
