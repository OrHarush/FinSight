import * as transactionRepository from '../repositories/transactionRepository';
import { ITransaction } from '../models/Transaction';
import Category from '../models/Category';
import { CreateTransactionCommand } from '@shared/types/TransactionCommands';
import { TransactionQueryOptions } from '../types/Transaction';

export const findAll = async (userId: string, options: TransactionQueryOptions = {}) =>
  transactionRepository.findMany(userId, options);

export const getTransactionSummary = async (userId: string, year: number, month?: number) =>
  transactionRepository.getSummary(userId, year, month);

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
