import dayjs from 'dayjs';
import { ITransaction } from '../models/Transaction';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export const expandRecurring = (tx: ITransaction, until: Date): any[] => {
  if (tx.recurrence === 'None') {
    return [tx];
  }

  const result: any[] = [];
  let currentDate = dayjs.utc(tx.date);
  const end = tx.endDate ? dayjs.utc(tx.endDate) : dayjs.utc(until);

  const dayOfMonth = currentDate.date();

  while (currentDate.isSameOrBefore(end, 'day')) {
    result.push({
      ...tx.toObject(),
      date: currentDate.toDate(),
      _id: `${tx._id}-${currentDate.toISOString()}`,
      originalId: tx._id,
    });

    if (tx.recurrence === 'Monthly') {
      let next = currentDate.add(1, 'month').startOf('month');

      if (dayOfMonth <= next.daysInMonth()) {
        next = next.date(dayOfMonth);
      } else {
        next = next.endOf('month');
      }

      currentDate = next;
    } else if (tx.recurrence === 'Yearly') {
      currentDate = currentDate.add(1, 'year').date(dayOfMonth);
    }
  }

  return result;
};

export const expandTransfer = (tx: any): any[] => {
  if (tx.type !== 'Transfer' || !tx.fromAccount || !tx.toAccount) {
    return [tx];
  }

  return [
    {
      ...tx,
      _id: `${tx._id}-out`,
      account: tx.fromAccount,
      amount: Math.abs(tx.amount),
      category: {
        _id: 'transfer',
        name: 'Transfer',
        icon: 'SwapHoriz',
        color: '#ff6b6b',
        type: 'Expense',
      },
    },
    {
      ...tx,
      _id: `${tx._id}-in`,
      account: tx.toAccount,
      amount: Math.abs(tx.amount),
      category: {
        _id: 'transfer',
        name: 'Transfer',
        icon: 'SwapHoriz',
        color: '#51cf66',
        type: 'Income',
      },
    },
  ];
};

export const expandTransactions = (transactions: ITransaction[], until: Date): any[] =>
  transactions.flatMap((tx) => expandRecurring(tx, until)).flatMap((tx) => expandTransfer(tx));
