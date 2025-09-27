import { ExtendedTransaction, TransactionDto } from '@/types/Transaction';
import dayjs from 'dayjs';

export const expandRecurring = (tx: TransactionDto, until: Date): ExtendedTransaction[] => {
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
};

export const expandTransactions = (
  transactions: TransactionDto[],
  until: Date
): ExtendedTransaction[] => transactions.flatMap(tx => expandRecurring(tx, until));

export const sortTransactionsByDate = (
  transactions: ExtendedTransaction[],
  order: 'asc' | 'desc' = 'desc'
): ExtendedTransaction[] =>
  [...transactions].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();

    return order === 'asc' ? aDate - bDate : bDate - aDate;
  });

// Filtering
export const filterTransactions = (
  transactions: ExtendedTransaction[],
  month?: number,
  year?: number,
  categoryId?: string
): ExtendedTransaction[] =>
  transactions.filter(tx => {
    const txDate = dayjs(tx.date);

    if (month !== undefined && year !== undefined) {
      if (!(txDate.month() === month && txDate.year() === year)) {
        return false;
      }
    }

    return !(categoryId && tx.category?._id !== categoryId);
  });

export const calculateBalanceTimeline = (
  transactions: ExtendedTransaction[],
  startBalance: number
) => {
  const year = dayjs().year();
  const startDate = dayjs(`${year}-01-01`);
  const endDate = dayjs(`${year}-12-31`);

  const expanded = expandTransactions(transactions, endDate.toDate());
  const sorted = sortTransactionsByDate(expanded, 'asc');

  const dailyTimeline: { date: Date; balance: number }[] = [];
  let balance = startBalance;

  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    sorted
      .filter(tx => dayjs(tx.date).isSame(currentDate, 'day'))
      .forEach(tx => {
        console.log(`===== ${currentDate.format('YYYY-MM-DD')}`);
        console.log(tx.name, tx.amount, tx.category.type);
        if (tx.category.type === 'Income') {
          balance += tx.amount;
        } else {
          balance -= tx.amount;
        }
      });

    dailyTimeline.push({
      date: currentDate.toDate(),
      balance,
    });

    currentDate = currentDate.add(1, 'day');
  }

  return dailyTimeline;
};
