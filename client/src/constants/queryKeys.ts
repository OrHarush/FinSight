export const queryKeys = {
  allTransactions: () => ['transactions'],
  transactions: (filters?: {
    year?: number;
    month?: number;
    categoryIds?: string[];
    accountIds?: string[];
    paymentMethodIds?: string[];
    page?: number;
    limit?: number;
    search?: string;
  }) => ['transactions', filters ?? {}],
  transaction: (id: string) => ['transactions', id],
  transactionSummary: (year: number, month: number, accountId: string, from?: string) => [
    'transactionSummary',
    year,
    month,
    accountId,
    from,
  ],
  transactionsCount: () => ['transactions', 'count'],
  quickChips: () => ['transactions', 'quickChips'],
  recurringTemplates: () => ['recurringTemplates'],

  accounts: () => ['accounts'],
  account: (id: string) => ['accounts', id],
  accountBalance: (accountId: string, asOf: string) => ['accountBalance', accountId, asOf],
  accountBalanceCurve: (accountId: string, from?: string, to?: string) => [
    'accountBalanceCurve',
    accountId,
    from ?? 'defaultFrom',
    to ?? 'defaultTo',
  ],

  categories: () => ['categories'],
  category: (id: string) => ['categories', id],

  budgets: (year: number, month?: number, categoryId?: string) => {
    const key: (string | number)[] = ['budgets', year];

    if (month !== undefined) {
      key.push(month);
    }

    if (categoryId !== undefined) {
      key.push(categoryId);
    }

    return key;
  },
  budget: (id: string) => ['budgets', id],

  paymentMethods: () => ['paymentMethods'],
  yearlyChart: (year: number) => ['yearlyChart', year],

  user: () => ['user'],

  adminAnalytics: () => ['admin-analytics'],
  adminDebugSnapshots: () => ['admin', 'debug-snapshots'],
  adminBalanceBreakdown: (accountId?: string) => ['admin', 'balance-breakdown', accountId ?? null],
};
