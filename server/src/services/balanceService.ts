import {
  BalanceBreakdownEntry,
  BalanceBreakdownResult,
  BalanceBreakdownTransactionType,
  toCents,
} from '@lyra/shared';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose from 'mongoose';

import { ApiError } from '../errors/ApiError';
import Account from '../models/Account';
import * as accountRepository from '../repositories/accountRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { ITransactionPopulated } from '../types/Transaction';
import { expandTransactions, getEffectiveBalanceDate, signedDeltaForAccount } from '../utils/transaction';

dayjs.extend(utc);

const buildBreakdownEntry = (
  tx: ITransactionPopulated,
  accountId: string,
  checkpointDate: Date,
  now: Date
): BalanceBreakdownEntry => {
  const effectiveDate = getEffectiveBalanceDate(tx);
  const pm = tx.paymentMethod;
  const type = tx.type as BalanceBreakdownTransactionType;

  const base: Omit<BalanceBreakdownEntry, 'included' | 'contributesToSum' | 'reason'> = {
    _id: String(tx._id),
    name: tx.name ?? '',
    date: tx.date ? new Date(tx.date).toISOString() : new Date(0).toISOString(),
    amount: tx.amount,
    type,
    paymentMethodType: pm?.type ?? null,
    billingDay: pm?.billingDay ?? null,
    effectiveBalanceDate: effectiveDate.toISOString(),
  };

  if (effectiveDate <= checkpointDate) {
    return {
      ...base,
      included: false,
      contributesToSum: 0,
      reason: 'effectiveBalanceDate <= checkpointDate',
    };
  }

  if (effectiveDate > now) {
    return {
      ...base,
      included: false,
      contributesToSum: 0,
      reason: 'effectiveBalanceDate > now (future)',
    };
  }

  if (type === 'Income') {
    return {
      ...base,
      included: true,
      contributesToSum: signedDeltaForAccount(tx, accountId),
      reason: 'Income → +amount',
    };
  }

  if (type === 'Expense') {
    return {
      ...base,
      included: true,
      contributesToSum: signedDeltaForAccount(tx, accountId),
      reason: 'Expense → -amount',
    };
  }

  const fromIsThis = tx.fromAccount?._id.toString() === accountId;
  const toIsThis = tx.toAccount?._id.toString() === accountId;

  if (!fromIsThis && !toIsThis) {
    return {
      ...base,
      included: false,
      contributesToSum: 0,
      reason: 'Transfer leg does not reference this account',
    };
  }

  const reasonParts: string[] = [];

  if (fromIsThis) reasonParts.push('fromAccount matches → -amount');
  if (toIsThis) reasonParts.push('toAccount matches → +amount');

  return {
    ...base,
    included: true,
    contributesToSum: signedDeltaForAccount(tx, accountId),
    reason: `Transfer: ${reasonParts.join(' & ')}`,
  };
};

export const computeAccountBalance = async (
  userId: string,
  accountId: string
): Promise<BalanceBreakdownResult> => {
  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  const checkpointDate = account.checkpointDate ?? new Date(0);
  const now = new Date();

  const queryFrom = dayjs.utc(checkpointDate).subtract(1, 'month').startOf('month').toDate();

  const rawTransactions = await transactionRepository.findMany(userId, {
    accountId,
    from: queryFrom,
  });

  let totalIncluded = 0;
  let totalSkippedPreCheckpoint = 0;
  let totalSkippedFuture = 0;
  const breakdown: BalanceBreakdownEntry[] = [];

  for (const tx of rawTransactions) {
    const entry = buildBreakdownEntry(tx, accountId, checkpointDate, now);
    breakdown.push(entry);

    if (entry.included) {
      totalIncluded += entry.contributesToSum;
      continue;
    }

    if (entry.reason.startsWith('effectiveBalanceDate <= checkpointDate')) {
      totalSkippedPreCheckpoint++;
    } else if (entry.reason.startsWith('effectiveBalanceDate > now')) {
      totalSkippedFuture++;
    }
  }

  return {
    accountId,
    accountName: account.name,
    checkpointBalance: account.checkpointBalance,
    checkpointDate: checkpointDate.toISOString(),
    now: now.toISOString(),
    totalIncluded,
    totalSkippedPreCheckpoint,
    totalSkippedFuture,
    finalBalance: account.checkpointBalance + totalIncluded,
    breakdown,
  };
};

export const syncAccountBalance = async (userId: string, accountId: string) => {
  const result = await computeAccountBalance(userId, accountId);

  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  account.balance = result.finalBalance;
  await account.save();

  return { balance: account.balance, syncedAt: new Date(result.now) };
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

      if (tx.account?._id.toString() !== accountId) {
        txIndex++;
        continue;
      }

      runningBalance += signedDeltaForAccount(tx, accountId);

      txIndex++;
    }

    days.push({
      date: current.toISOString(),
      balance: runningBalance,
    });
  }

  return days;
};
