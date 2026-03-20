import { CreateTransactionDTO, UpdateTransactionDTO } from '@finsight/shared';
import mongoose from 'mongoose';

import { ApiError } from '../errors/ApiError';
import Category from '../models/Category';
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

  const txWithEffectiveMonth = expandedTransactions.map((tx) => {
    const { year, month } = getEffectiveMonth(tx);

    return { ...tx, effectiveYear: year, effectiveMonth: month };
  });

  let filtered = filterTransactionsByDateRange(txWithEffectiveMonth, from, to);

  if (targetYear != null && targetMonth != null) {
    filtered = (filtered as TxWithEffective[]).filter(
      (tx) => tx.effectiveYear === targetYear && tx.effectiveMonth === targetMonth
    );
  }

  if (search) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter((t) => t.name.toLowerCase().includes(term));
  }

  return sortAndPaginate(filtered, sort, page, limit);
};

export const getTransactionById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid transaction ID');
  }

  const transaction = await transactionRepository.findById(id, userId);
  if (!transaction) {
    throw ApiError.notFound('Transaction not found');
  }

  return transaction;
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

  const expandedTransactions = transactions.flatMap((tx) => expandRecurring(tx, fromDate, endDate));

  if (month !== undefined) {
    return summarizeSingleMonth(expandedTransactions, year, month, accountId);
  }

  return summarizeWholeYear(expandedTransactions, year, accountId);
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

  if (data.recurrence === 'None' && data.date) {
    const dateOnly = new Date(data.date);
    const now = new Date();

    dateOnly.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    data.date = dateOnly.toISOString();
  }

  return transactionRepository.insert(data, userId);
};

export const update = async (id: string, data: UpdateTransactionDTO, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid transaction ID');
  }

  const existing = await transactionRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Transaction not found');
  }

  const updated = await transactionRepository.updateById(id, data, userId);

  if (!updated) {
    throw ApiError.internal('Unexpected error updating transaction');
  }

  return updated;
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

  return deleted;
};
