export const queryKeys = {
  allTransactions: () => ['transactions'],
  transactions: (filters?: {
    year?: number;
    month?: number;
    categoryId?: string;
    accountId?: string;
    page?: number;
    limit?: number;
  }) => ['transactions', filters ?? {}],
  transaction: (id: string) => ['transactions', id],
  transactionSummary: (year: number, month: number) => ['transactionSummary', year, month],

  categories: () => ['categories'],
  category: (id: string) => ['categories', id],

  accounts: () => ['accounts'],
  account: (id: string) => ['accounts', id],

  user: () => ['user'],
};
