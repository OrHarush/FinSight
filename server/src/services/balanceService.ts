import * as transactionRepository from '../repositories/transactionRepository';
import dayjs from 'dayjs';
import Account from '../models/Account';
import { Types } from 'mongoose';
import { expandTransactions } from '../utils/transactionUtils';

export const calculateAccountBalanceCurve = async (
  userId: string,
  accountId: string,
  from?: string,
  to?: string
) => {
  const start = from ? dayjs.utc(from) : dayjs.utc().startOf('month');
  const end = to ? dayjs.utc(to) : dayjs.utc().endOf('month');

  const account = await Account.findOne({
    _id: new Types.ObjectId(accountId),
    userId: new Types.ObjectId(userId),
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const { data: transactions } = await transactionRepository.findMany(userId, {
    from: start.toISOString(),
    to: end.toISOString(),
    sort: 'asc',
    accountId,
  });

  const days: { date: string; balance: number }[] = [];
  let runningBalance = account.balance;

  const sortedTx = transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let txIndex = 0;

  for (
    let current = start.clone();
    current.isSameOrBefore(end, 'day');
    current = current.add(1, 'day')
  ) {
    while (txIndex < sortedTx.length && dayjs(sortedTx[txIndex].date).isSame(current, 'day')) {
      const tx = sortedTx[txIndex];

      if (tx.category?.type === 'Income') {
        runningBalance += tx.amount;
      } else if (tx.category?.type === 'Expense') {
        runningBalance -= tx.amount;
      }

      txIndex++;
    }

    days.push({ date: current.toISOString(), balance: runningBalance });
  }

  return days;
};
