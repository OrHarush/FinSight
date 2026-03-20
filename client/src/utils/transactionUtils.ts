import { CreateTransactionDTO, TransactionFormValues } from '@finsight/shared';

import { ExpandedTransactionDto } from '@/types/Transaction';

export const mapTransactionFormValuesToPayload = (
  data: TransactionFormValues
): CreateTransactionDTO => {
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
    return {
      ...base,
      name: data.name,
      categoryId: data.category,
      accountId: data.account,
    };
  }

  if (data.type === 'Transfer') {
    return {
      ...base,
      fromAccountId: data.fromAccount,
      toAccountId: data.toAccount,
    };
  }

  return base;
};

export const getTransactionDisplayDate = (tx: ExpandedTransactionDto) => {
  if (tx.date) {
    return tx.date;
  }

  return tx!.startDate!;
};
