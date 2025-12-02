import * as transactionRepository from '../repositories/transactionRepository';
import { ITransaction } from '../models/Transaction';
import Category from '../models/Category';
import { CreateTransactionCommand } from '@shared/types/TransactionCommmands';
import { TransactionQueryOptions } from '../types/Transaction';
import {
  expandTransactions,
  filterTransactionsByBillingPeriod,
  filterTransactionsByDateRange,
  sortAndPaginate,
} from '../utils/transactionUtils';

export const findAll = async (userId: string, options: TransactionQueryOptions = {}) => {
  const { page, limit, from, to, targetYear, targetMonth, sort = 'desc', search } = options;
  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;

  const transactions = await transactionRepository.findMany(userId, options);

  const expandedTransactions = expandTransactions(transactions, to ?? new Date());
  let filteredTransaction = filterTransactionsByDateRange(expandedTransactions, fromDate, toDate);

  if (targetYear != null && targetMonth != null) {
    filteredTransaction = filterTransactionsByBillingPeriod(
      filteredTransaction,
      targetYear,
      targetMonth
    );
  }

  if (search) {
    const term = search.trim().toLowerCase();
    filteredTransaction = filteredTransaction.filter((t) => t.name.toLowerCase().includes(term));
  }

  return sortAndPaginate(filteredTransaction, sort, page, limit);
};

export const getTransactionSummary = async (
  userId: string,
  year: number,
  month?: number,
  accountId?: string
) => transactionRepository.getSummary(userId, year, month, accountId);

export const getTransactionById = async (id: string, userId: string) =>
  transactionRepository.findById(id, userId);

export const create = async (data: CreateTransactionCommand, userId: string) => {
  if (!data.type) {
    throw new Error('Transaction type is required');
  }

  if (data.type === 'Transfer') {
    if (!data.fromAccountId || !data.toAccountId) {
      throw new Error('Transfer requires both fromAccount and toAccount');
    }
    if (String(data.fromAccountId) === String(data.toAccountId)) {
      throw new Error('Transfer cannot use the same account for fromAccount and toAccount');
    }
    if (data.categoryId) {
      throw new Error('Transfer should not have a category');
    }
  }

  if (data.type === 'Expense' || data.type === 'Income') {
    if (!data.accountId) {
      throw new Error('Income/Expense requires an account');
    }
    if (!data.categoryId) {
      throw new Error('Income/Expense requires a category');
    }

    const category = await Category.findOne({ _id: data.categoryId, userId });

    if (!category) {
      throw new Error('Invalid category for this user');
    }

    if (category.type !== data.type) {
      throw new Error(
        `Category type mismatch: category is ${category.type} but transaction is ${data.type}`
      );
    }

    if (data.fromAccountId || data.toAccountId) {
      throw new Error('Income/Expense should not use fromAccount/toAccount');
    }
  }

  if (data.recurrence != 'None') {
    if (!data.startDate) {
      throw new Error('Recurring transactions require startDate');
    }
    if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
      throw new Error('startDate cannot be after endDate for recurring transactions');
    }
  }

  return transactionRepository.insert(data, userId);
};

export const update = async (id: string, data: Partial<ITransaction>, userId: string) =>
  transactionRepository.updateById(id, data, userId);

export const deleteTransaction = async (id: string, userId: string) =>
  transactionRepository.remove(id, userId);
