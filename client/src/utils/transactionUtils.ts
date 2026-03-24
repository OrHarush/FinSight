import {
  CreateTransactionDTO,
  TransactionFormValues,
  UpdateTransactionDTO,
} from '@finsight/shared';

import { ExpandedTransactionDto } from '@/types/Transaction';

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

export const getFilterChipLabel = (
  count: number,
  allLabel: string,
  t: (key: string, options?: { count: number }) => string,
  pluralKey: string,
): string => {
  if (count === 0) {
    return allLabel;
  }

  return t(pluralKey, { count });
};

export const getTransactionDisplayDate = (tx: ExpandedTransactionDto) => {
  if (tx.date) {
    return tx.date;
  }

  return tx!.startDate!;
};
