import {
  CreateTransactionDTO,
  TransactionFormValues,
  UpdateTransactionDTO,
} from '@finsight/shared';

import {
  ExpandedTransactionDto,
  SortableColumn,
  SortOrder,
  TransactionDto,
} from '@/types/Transaction';
import { PAYMENT_TYPE_LOCALE_KEY } from '@/utils/paymentMethodUtils';

const buildTransactionPayload = (data: TransactionFormValues) => {
  const base = {
    amount: Number(data.amount),
    date: data.date ? new Date(data.date).toISOString() : undefined,
    recurrence: data.recurrence,
    type: data.type,
    belongToPreviousMonth: data.belongToPreviousMonth,
    paymentMethodId: data.paymentMethod,
    endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
  };

  if (data.type === 'Expense' || data.type === 'Income') {
    return { ...base, name: data.name, categoryId: data.category, accountId: data.account };
  }

  return { ...base, fromAccountId: data.fromAccount, toAccountId: data.toAccount };
};

export const mapToCreatePayload = (data: TransactionFormValues): CreateTransactionDTO =>
  buildTransactionPayload(data);

export const mapToUpdatePayload = (data: TransactionFormValues): UpdateTransactionDTO =>
  buildTransactionPayload(data);

export const getTransactionDisplayDate = (tx: ExpandedTransactionDto) => {
  if (tx.date) {
    return tx.date;
  }

  return tx!.startDate!;
};

const getSortValue = (tx: ExpandedTransactionDto, column: SortableColumn): string | number => {
  switch (column) {
    case 'name':
      return tx.name?.toLowerCase() ?? '';
    case 'amount':
      return tx.amount;
    case 'category':
      return tx.category?.name?.toLowerCase() ?? '';
    case 'account':
      return tx.account?.name?.toLowerCase() ?? '';
    case 'paymentMethod':
      return (
        tx.paymentMethod?.name ||
        PAYMENT_TYPE_LOCALE_KEY[tx.paymentMethod?.type] ||
        ''
      ).toLowerCase();
    case 'date':
      return tx.date ?? tx.startDate ?? '';
  }
};

export const compareTransactions = (
  a: TransactionDto,
  b: TransactionDto,
  order: SortOrder,
  orderBy: SortableColumn
): number => {
  const aVal = getSortValue(a, orderBy);
  const bVal = getSortValue(b, orderBy);

  if (aVal < bVal) {
    return order === 'asc' ? -1 : 1;
  }

  if (aVal > bVal) {
    return order === 'asc' ? 1 : -1;
  }

  return 0;
};
