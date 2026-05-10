import { CreateTransactionDTO, fromCents, toCents, UpdateTransactionDTO } from '@lyra/shared';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../../errors/ApiError';
import Category from '../../models/Category';
import { ITransaction } from '../../models/Transaction';
import User from '../../models/User';
import * as analyticsEventRepository from '../../repositories/analyticsEventRepository';
import * as recurringTemplateRepository from '../../repositories/recurringTemplateRepository';
import * as transactionRepository from '../../repositories/transactionRepository';
import {
  GetTransactionsOptions,
  GetTransactionSummaryQuery,
} from '../../schemas/transactionSchemas';
import { ITransactionPopulated } from '../../types/Transaction';
import { isCategoryCompatibleWithTransactionType } from '../../utils/categoryCompatibility';
import { isExcludedEmail } from '../../utils/excludedEmails';
import {
  expandTransactions,
  filterTemplatesByQueryFilters,
  filterTransactionsByDateRange,
  getEffectiveMonth,
  sortAndPaginate,
  summarizeSingleMonth,
  summarizeWholeYear,
} from '../../utils/transaction';
import * as accountService from '../accountService';
import { syncAccountBalance } from '../balanceService';
import { buildVirtualTransactions } from './buildVirtualTransactions';
import { invalidateQuickChipsCache } from './quickChipsService';

dayjs.extend(utc);

const syncBalanceFor = async (userId: string, accountIds: (string | undefined)[]) => {
  const unique = [...new Set(accountIds.filter(Boolean))] as string[];

  const results = await Promise.allSettled(unique.map(id => syncAccountBalance(userId, id)));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Balance sync failed for account ${unique[index]}:`, result.reason);
    }
  });
};

type TxWithEffective = ITransactionPopulated & {
  effectiveYear: number;
  effectiveMonth: number;
};

// options is GetTransactionsQuery when called from HTTP controller (fully validated)
// and GetTransactionsOptions when called from internal callers (partial)
export const findAll = async (userId: string, options: GetTransactionsOptions = {}) => {
  const {
    page,
    limit,
    from,
    to,
    targetYear,
    targetMonth,
    sort,
    search,
    categoryIds,
    paymentMethodIds,
    accountIds,
    accountId,
  } = options;
  const resolvedAccountIds = accountIds ?? (accountId ? [accountId] : undefined);

  const transactions = await transactionRepository.findMany(userId, options);

  if (from && to) {
    const templates = await recurringTemplateRepository.findActiveForDateRangePopulated(
      userId,
      from,
      to
    );
    const matchingTemplates = filterTemplatesByQueryFilters(
      templates,
      categoryIds,
      paymentMethodIds,
      resolvedAccountIds
    );
    const virtualTransactions = buildVirtualTransactions(
      matchingTemplates,
      transactions,
      from,
      to
    );

    transactions.push(...virtualTransactions);
  }

  const expandedTransactions = expandTransactions(transactions);

  const txWithEffectiveMonth = expandedTransactions.map(tx => {
    const { year, month } = getEffectiveMonth(tx);

    return { ...tx, effectiveYear: year, effectiveMonth: month };
  });

  let filtered = filterTransactionsByDateRange(txWithEffectiveMonth, from, to);

  if (targetYear != null && targetMonth != null) {
    filtered = (filtered as TxWithEffective[]).filter(
      tx => tx.effectiveYear === targetYear && tx.effectiveMonth === targetMonth
    );
  }

  if (search) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter(t => t.name?.toLowerCase().includes(term));
  }

  const result = sortAndPaginate(filtered, sort, page, limit);

  return {
    ...result,
    data: result.data.map(tx => ({ ...tx, amount: fromCents(tx.amount) })),
  };
};

export const getTransactionById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid transaction ID');
  }

  const transaction = await transactionRepository.findById(id, userId);

  if (!transaction) {
    throw ApiError.notFound('Transaction not found');
  }

  return { ...transaction, amount: fromCents(transaction.amount) };
};

export const getTransactionSummary = async (userId: string, query: GetTransactionSummaryQuery) => {
  const { year, month, accountId, from } = query;

  const targetMonthStart =
    month !== undefined ? new Date(Date.UTC(year, month, 1)) : new Date(Date.UTC(year, 0, 1));
  const fromDate = dayjs.utc(targetMonthStart).subtract(1, 'month').startOf('month').toDate();
  const endDate =
    month !== undefined
      ? new Date(Date.UTC(year, month + 2, 1))
      : new Date(Date.UTC(year + 1, 0, 1));

  const transactions = await transactionRepository.findMany(userId, {
    accountId,
    from: fromDate,
    to: endDate,
  });

  const templates = await recurringTemplateRepository.findActiveForDateRangePopulated(
    userId,
    fromDate,
    endDate
  );

  const virtualTransactions = buildVirtualTransactions(templates, transactions, fromDate, endDate);

  transactions.push(...virtualTransactions);

  if (month !== undefined) {
    const result = summarizeSingleMonth(
      transactions,
      year,
      month,
      accountId,
      from,
      new Date()
    );

    return {
      monthlyIncome: fromCents(result.monthlyIncome),
      monthlyExpenses: fromCents(result.monthlyExpenses),
      pendingPriorIncome: fromCents(result.pendingPriorIncome),
      pendingPriorExpenses: fromCents(result.pendingPriorExpenses),
    };
  }

  return summarizeWholeYear(transactions, year, accountId).map(bucket => ({
    ...bucket,
    monthlyIncome: fromCents(bucket.monthlyIncome),
    monthlyExpenses: fromCents(bucket.monthlyExpenses),
  }));
};

export const countAll = async (userId: string): Promise<number> =>
  transactionRepository.countByUser(userId);

export const create = async (data: CreateTransactionDTO, userId: string) => {
  if ((data.type === 'Expense' || data.type === 'Income') && data.categoryId) {
    const category = await Category.findOne({ _id: data.categoryId, userId });

    if (!category) {
      throw ApiError.badRequest('Invalid category for this user');
    }

    if (!isCategoryCompatibleWithTransactionType(category.type, data.type)) {
      throw ApiError.badRequest(
        `Category type mismatch: category is ${category.type} but transaction is ${data.type}`
      );
    }
  }

  const mapped: Omit<ITransaction, '_id'> = {
    name: data.name ?? '',
    note: data.note,
    type: data.type,
    amount: toCents(data.amount),
    belongToPreviousMonth: data.belongToPreviousMonth ?? false,
    date: data.date ? new Date(data.date) : undefined,
    category: data.categoryId ? new Types.ObjectId(data.categoryId) : undefined,
    paymentMethod: data.paymentMethodId ? new Types.ObjectId(data.paymentMethodId) : undefined,
    account: data.accountId ? new Types.ObjectId(data.accountId) : undefined,
    fromAccount: data.fromAccountId ? new Types.ObjectId(data.fromAccountId) : undefined,
    toAccount: data.toAccountId ? new Types.ObjectId(data.toAccountId) : undefined,
    userId: new Types.ObjectId(userId),
  };

  const created = await transactionRepository.insert(mapped);

  invalidateQuickChipsCache(userId);
  await syncBalanceFor(userId, [data.accountId, data.fromAccountId, data.toAccountId]);
  const accounts = await accountService.findAll(userId);

  void (async () => {
    const user = await User.findById(userId).select('email name picture').lean();

    if (user && isExcludedEmail(user.email)) {
      return;
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $set: { lastActiveAt: new Date() },
        $inc: { totalTransactions: 1 },
      }),
      analyticsEventRepository.insertEvent(
        'transaction_created',
        user?.name ?? '',
        user?.picture ?? '',
      ),
    ]);
  })().catch(err => console.error('Failed to track transaction activity:', err));

  created.amount = fromCents(created.amount);

  return { transaction: created, accounts };
};

export const update = async (id: string, data: UpdateTransactionDTO, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid transaction ID');
  }

  const existing = await transactionRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Transaction not found');
  }

  const mapped: Partial<ITransaction> = {};

  if (data.name !== undefined) mapped.name = data.name;
  if (data.note !== undefined) mapped.note = data.note;
  if (data.type !== undefined) mapped.type = data.type;
  if (data.amount !== undefined) mapped.amount = toCents(data.amount);
  if (data.belongToPreviousMonth !== undefined)
    mapped.belongToPreviousMonth = data.belongToPreviousMonth;
  if (data.date !== undefined) mapped.date = new Date(data.date);
  if (data.categoryId !== undefined) mapped.category = new Types.ObjectId(data.categoryId);
  if (data.paymentMethodId !== undefined)
    mapped.paymentMethod = new Types.ObjectId(data.paymentMethodId);
  if (data.accountId !== undefined) mapped.account = new Types.ObjectId(data.accountId);
  if (data.fromAccountId !== undefined) mapped.fromAccount = new Types.ObjectId(data.fromAccountId);
  if (data.toAccountId !== undefined) mapped.toAccount = new Types.ObjectId(data.toAccountId);

  const updated = await transactionRepository.updateById(id, mapped, userId);

  if (!updated) {
    throw ApiError.internal('Unexpected error updating transaction');
  }

  invalidateQuickChipsCache(userId);
  await syncBalanceFor(userId, [
    existing.account?._id.toString(),
    existing.fromAccount?._id.toString(),
    existing.toAccount?._id.toString(),
    data.accountId,
    data.fromAccountId,
    data.toAccountId,
  ]);
  const accounts = await accountService.findAll(userId);

  return { transaction: { ...updated, amount: fromCents(updated.amount) }, accounts };
};

export const deleteTransaction = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid transaction ID');
  }

  const existing = await transactionRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Transaction not found');
  }

  const deleted = await transactionRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.internal('Unexpected error deleting transaction');
  }

  invalidateQuickChipsCache(userId);
  await syncBalanceFor(userId, [
    existing.account?._id.toString(),
    existing.fromAccount?._id.toString(),
    existing.toAccount?._id.toString(),
  ]);

  return { ...deleted, amount: fromCents(deleted.amount) };
};
