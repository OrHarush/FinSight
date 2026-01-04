export const queryKeys = {
  allTransactions: () => ['transactions'],
  transactions: (filters?: {
    year?: number;
    month?: number;
    categoryId?: string;
    accountId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => ['transactions', filters ?? {}],
  transaction: (id: string) => ['transactions', id],
  transactionSummary: (year: number, month: number, accountId: string) => [
    'transactionSummary',
    year,
    month,
    accountId,
  ],
  transactionsCount: () => ['transactions', 'count'],

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

  paymentMethods: () => ['paymentMethods'],
  yearlyChart: (year: number) => ['yearlyChart', year],

  user: () => ['user'],

  kpis: () => ['admin-kpis'],
  activity: () => ['admin-activity'],
};
