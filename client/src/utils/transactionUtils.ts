import { ExtendedTransaction, TransactionDto } from '@/types/Transaction';
import dayjs from 'dayjs';

export function expandRecurring(tx: TransactionDto, until: Date): ExtendedTransaction[] {
  if (tx.recurrence === 'None') {
    return [{ ...tx, originalId: tx._id }];
  }

  const result: ExtendedTransaction[] = [];
  let currentDate = dayjs(tx.date);
  const end = tx.endDate ? dayjs(tx.endDate) : dayjs(until);

  while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
    result.push({
      ...tx,
      date: currentDate.toISOString(),
      _id: `${tx._id}-${currentDate.toISOString()}`,
      originalId: tx._id,
    });

    currentDate =
      tx.recurrence === 'Monthly' ? currentDate.add(1, 'month') : currentDate.add(1, 'year');
  }

  return result;
}

export function expandTransactions(
  transactions: TransactionDto[],
  until: Date
): ExtendedTransaction[] {
  return transactions.flatMap(tx => expandRecurring(tx, until));
}
