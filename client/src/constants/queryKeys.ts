export const queryKeys = {
  transactions: () => ['transactions'],
  transaction: (id: string) => ['transactions', id],
  categories: () => ['categories'],
  category: (id: string) => ['categories', id],
  accounts: () => ['accounts'],
  account: (id: string) => ['accounts', id],
};
