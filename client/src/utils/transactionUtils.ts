import { TransactionFormValues } from '@/types/Transaction';
import { CreateTransactionCommand } from '../../../shared/types/TransactionCommands';

export const mapTransactionFormValuesToPayload = (
  data: TransactionFormValues
): CreateTransactionCommand => {
  const base = {
    amount: Number(data.amount),
    date: new Date(data.date).toISOString(),
    recurrence: data.recurrence,
    type: data.type,
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
