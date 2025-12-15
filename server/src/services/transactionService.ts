import * as transactionRepository from '../repositories/transactionRepository';
import { ITransaction } from '../models/Transaction';
import Category from '../models/Category';
import { CreateTransactionCommand } from '@shared/types/TransactionCommmands';
import { ITransactionPopulated, TransactionQueryOptions } from '../types/Transaction';
import {
  expandTransactions,
  filterTransactionsByDateRange,
  getEffectiveMonth,
  sortAndPaginate,
  summarizeSingleMonth,
  summarizeWholeYear,
} from '../utils/transactionUtils';
import { ApiError } from '../errors/ApiError';
import mongoose from 'mongoose';

type TxWithEffective = ITransactionPopulated & {
  effectiveYear: number;
  effectiveMonth: number;
};

export const findAll = async (userId: string, options: TransactionQueryOptions = {}) => {
  const { page, limit, from, to, targetYear, targetMonth, sort = 'desc', search } = options;

  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;

  const transactions = await transactionRepository.findMany(userId, options);

  const expandedTransactions = expandTransactions(
    transactions,
    fromDate ?? new Date(0),
    to ?? new Date()
  );

  const txWithEffectiveMonth = expandedTransactions.map((tx) => {
    const { year, month } = getEffectiveMonth(tx);

    return { ...tx, effectiveYear: year, effectiveMonth: month };
  });

  let filtered = filterTransactionsByDateRange(txWithEffectiveMonth, fromDate, toDate);

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

export const getTransactionSummary = async (
  userId: string,
  year: number,
  month?: number,
  accountId?: string
) => {
  if (!year) {
    throw ApiError.badRequest('Year is required');
  }

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

  const expandedTransactions = expandTransactions(transactions, fromDate, endDate);

  if (month !== undefined) {
    return summarizeSingleMonth(expandedTransactions, year, month, accountId);
  }

  return summarizeWholeYear(expandedTransactions, year, accountId);
};

export const create = async (data: CreateTransactionCommand, userId: string) => {
  if (!data.type) throw ApiError.badRequest('Transaction type is required');

  if (data.type === 'Transfer') {
    if (!data.fromAccountId || !data.toAccountId) {
      throw ApiError.badRequest('Transfer requires both fromAccount and toAccount');
    }

    if (String(data.fromAccountId) === String(data.toAccountId)) {
      throw ApiError.badRequest(
        'Transfer cannot use the same account for fromAccount and toAccount'
      );
    }

    if (data.categoryId) {
      throw ApiError.badRequest('Transfer should not have a category');
    }
  }

  if (data.type === 'Expense' || data.type === 'Income') {
    if (!data.accountId) throw ApiError.badRequest('Income/Expense requires an account');
    if (!data.categoryId) throw ApiError.badRequest('Income/Expense requires a category');

    if (!mongoose.Types.ObjectId.isValid(data.categoryId)) {
      throw ApiError.badRequest('Invalid category ID');
    }

    const category = await Category.findOne({ _id: data.categoryId, userId });
    if (!category) throw ApiError.badRequest('Invalid category for this user');

    if (category.type !== data.type) {
      throw ApiError.badRequest(
        `Category type mismatch: category is ${category.type} but transaction is ${data.type}`
      );
    }
  }

  if (data.recurrence !== 'None') {
    if (!data.startDate) {
      throw ApiError.badRequest('Recurring transactions require startDate');
    }

    if (data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      throw ApiError.badRequest('startDate cannot be after endDate');
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

export const update = async (id: string, data: Partial<ITransaction>, userId: string) => {
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
