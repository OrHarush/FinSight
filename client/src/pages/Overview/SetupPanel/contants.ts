export const QUICK_ADD_KEYS = ['salary', 'coffee', 'rent', 'bit'] as const;
export type QuickAddKey = (typeof QUICK_ADD_KEYS)[number];

export const QUICK_ADD_CONFIG: Record<QuickAddKey, { type: 'Income' | 'Expense'; amount: number }> =
  {
    salary: { type: 'Income', amount: 8500 },
    coffee: { type: 'Expense', amount: 14 },
    rent: { type: 'Expense', amount: 3500 },
    bit: { type: 'Expense', amount: 200 },
  };
