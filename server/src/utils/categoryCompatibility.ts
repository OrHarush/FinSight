import { ICategory } from '../models/Category';
import { ITransaction } from '../models/Transaction';

type CategoryType = ICategory['type'];
type TransactionType = ITransaction['type'];

export const isCategoryCompatibleWithTransactionType = (
  categoryType: CategoryType,
  transactionType: TransactionType
): boolean => {
  if (categoryType === transactionType) {
    return true;
  }

  if (categoryType === 'Savings') {
    return transactionType === 'Expense' || transactionType === 'Income';
  }

  return false;
};
