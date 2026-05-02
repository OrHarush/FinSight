import { toCents } from '@lyra/shared';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose from 'mongoose';

import { ApiError } from '../errors/ApiError';
import Account from '../models/Account';
import * as accountRepository from '../repositories/accountRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { expandTransactions, getEffectiveBalanceDate } from '../utils/transaction';

dayjs.extend(utc);

export const syncAccountBalance = async (userId: string, accountId: string) => {
  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  const checkpointDate = account.checkpointDate ?? new Date(0);
  const now = new Date();

  const rawTransactions = await transactionRepository.findMany(userId, {
    accountId,
    from: checkpointDate,
  });

  const expanded = expandTransactions(rawTransactions);

  let sum = 0;

  for (const tx of expanded) {
    const effectiveDate = getEffectiveBalanceDate(tx);

    if (effectiveDate <= checkpointDate || effectiveDate > now) {
      continue;
    }

    if (tx.type === 'Income') {
      sum += tx.amount;
    }

    if (tx.type === 'Expense') {
      sum -= tx.amount;
    }

    if (tx.type === 'Transfer') {
      if (tx.fromAccount?._id.toString() === account._id.toString()) {
        sum -= tx.amount;
      }

      if (tx.toAccount?._id.toString() === account._id.toString()) {
        sum += tx.amount;
      }
    }
  }

  account.balance = account.checkpointBalance + sum;

  await account.save();

  return { balance: account.balance, syncedAt: now };
};

export const setBalanceCheckpoint = async (
  userId: string,
  accountId: string,
  balance: number
) => {
  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  account.checkpointBalance = toCents(balance);
  account.checkpointDate = new Date();

  await account.save();

  return syncAccountBalance(userId, accountId);
};

export const syncAllAccountsForUser = async (userId: string) => {
  const accounts = await accountRepository.findMany(userId);

  const results = await Promise.allSettled(
    accounts.map(a => syncAccountBalance(userId, a._id.toString()))
  );

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const accountId = accounts[index]._id.toString();
      console.error(`Balance sync failed for account ${accountId}:`, result.reason);
    }
  });
};

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

  const transactions = expandTransactions(rawTransactions);

  const sortedTx = transactions.sort(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const days: { date: string; balance: number }[] = [];
  let runningBalance = account.balance;
  let txIndex = 0;

  for (let current = start.clone(); !current.isAfter(end, 'day'); current = current.add(1, 'day')) {
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
