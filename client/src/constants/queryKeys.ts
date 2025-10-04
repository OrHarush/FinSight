export const queryKeys = {
  transactions: (filters?: {
    year?: number;
    month?: number;
    categoryId?: string;
    accountId?: string;
  }) => ['transactions', filters ?? {}],
  transaction: (id: string) => ['transactions', id],
  transactionSummary: (year: number, month: number) => ['transactionSummary', year, month],

  categories: () => ['categories'],
  category: (id: string) => ['categories', id],

  accounts: () => ['accounts'],
  account: (id: string) => ['accounts', id],
};
