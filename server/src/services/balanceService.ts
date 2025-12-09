import * as transactionRepository from '../repositories/transactionRepository';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose from 'mongoose';
import Account from '../models/Account';
import { expandTransactions } from '../utils/transactionUtils';
import { ApiError } from '../errors/ApiError';

dayjs.extend(utc);

export const calculateAccountBalanceCurve = async (
  userId: string,
  accountId: string,
  from?: string,
  to?: string
) => {
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const start = from ? dayjs.utc(from) : dayjs.utc().startOf('month');
  const end = to ? dayjs.utc(to) : dayjs.utc().endOf('month');

  if (!start.isValid() || !end.isValid()) {
    throw ApiError.badRequest('Invalid date range');
  }

  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  const rawTransactions = await transactionRepository.findMany(userId, {
    from: start.toDate(),
    to: end.toDate(),
    sort: 'asc',
    accountId,
  });

  const transactions = expandTransactions(rawTransactions, end.toDate());

  const sortedTx = transactions.sort(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const days: { date: string; balance: number }[] = [];
  let runningBalance = account.balance;
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

    days.push({
      date: current.toISOString(),
      balance: runningBalance,
    });
  }

  return days;
};
