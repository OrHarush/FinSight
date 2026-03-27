import { CreateTransactionDTO, UpdateTransactionDTO, fromCents, toCents } from '@finsight/shared';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import Category from '../models/Category';
import { ITransaction } from '../models/Transaction';
import * as transactionRepository from '../repositories/transactionRepository';
import { GetTransactionsOptions, GetTransactionSummaryQuery } from '../schemas/transactionSchemas';
import { ITransactionPopulated } from '../types/Transaction';
import {
  expandRecurring,
  expandTransactions,
  filterTransactionsByDateRange,
  getEffectiveMonth,
  sortAndPaginate,
  summarizeSingleMonth,
  summarizeWholeYear,
} from '../utils/transactionUtils';

type TxWithEffective = ITransactionPopulated & {
  effectiveYear: number;
  effectiveMonth: number;
};

// options is GetTransactionsQuery when called from HTTP controller (fully validated)
// and GetTransactionsOptions when called from internal callers (partial)
export const findAll = async (userId: string, options: GetTransactionsOptions = {}) => {
  const { page, limit, from, to, targetYear, targetMonth, sort, search } = options;

  const transactions = await transactionRepository.findMany(userId, options);

  const expandedTransactions = expandTransactions(
    transactions,
    from ?? new Date(0),
    to ?? new Date()
  );

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
  const { year, month, accountId } = query;

  const fromDate =
    month !== undefined ? new Date(Date.UTC(year, month, 1)) : new Date(Date.UTC(year, 0, 1));
  const endDate =
    month !== undefined
      ? new Date(Date.UTC(year, month + 2, 1))
      : new Date(Date.UTC(year + 1, 0, 1));

  const transactions = await transactionRepository.findMany(userId, {
    accountId,
    from: fromDate,
    to: endDate,
  });

  const expandedTransactions = transactions.flatMap(tx => expandRecurring(tx, fromDate, endDate));

  if (month !== undefined) {
    const result = summarizeSingleMonth(expandedTransactions, year, month, accountId);

    return {
      monthlyIncome: fromCents(result.monthlyIncome),
      monthlyExpenses: fromCents(result.monthlyExpenses),
    };
  }

  return summarizeWholeYear(expandedTransactions, year, accountId).map(bucket => ({
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

    if (category.type !== data.type) {
      throw ApiError.badRequest(
        `Category type mismatch: category is ${category.type} but transaction is ${data.type}`
      );
    }
  }

  let dateValue: Date | undefined;

  if (data.recurrence === 'None' && data.date) {
    const dateOnly = new Date(data.date);
    const now = new Date();

    dateOnly.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    dateValue = dateOnly;
  } else if (data.date) {
    dateValue = new Date(data.date);
  }

  const mapped: Omit<ITransaction, '_id'> = {
    name: data.name ?? '',
    description: data.description,
    type: data.type,
    amount: toCents(data.amount),
    recurrence: data.recurrence,
    belongToPreviousMonth: data.belongToPreviousMonth ?? false,
    date: dateValue,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    category: data.categoryId ? new Types.ObjectId(data.categoryId) : undefined,
    paymentMethod: data.paymentMethodId ? new Types.ObjectId(data.paymentMethodId) : undefined,
    account: data.accountId ? new Types.ObjectId(data.accountId) : undefined,
    fromAccount: data.fromAccountId ? new Types.ObjectId(data.fromAccountId) : undefined,
    toAccount: data.toAccountId ? new Types.ObjectId(data.toAccountId) : undefined,
    userId: new Types.ObjectId(userId),
  };

  const created = await transactionRepository.insert(mapped);

  created.amount = fromCents(created.amount);

  return created;
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
  if (data.description !== undefined) mapped.description = data.description;
  if (data.type !== undefined) mapped.type = data.type;
  if (data.amount !== undefined) mapped.amount = toCents(data.amount);
  if (data.recurrence !== undefined) mapped.recurrence = data.recurrence;
  if (data.belongToPreviousMonth !== undefined)
    mapped.belongToPreviousMonth = data.belongToPreviousMonth;
  if (data.date !== undefined) mapped.date = new Date(data.date);
  if (data.startDate !== undefined) mapped.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) mapped.endDate = new Date(data.endDate);
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

  return { ...updated, amount: fromCents(updated.amount) };
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

  return { ...deleted, amount: fromCents(deleted.amount) };
};
