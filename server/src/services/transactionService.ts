import * as transactionRepository from '../repositories/transactionRepository';
import { ITransaction } from '../models/Transaction';

export const getTransactions = async (userId: string) => {
  return transactionRepository.findAll(userId);
};

export const getTransactionById = async (id: string, userId: string) => {
  return transactionRepository.findById(id, userId);
};

export const createTransaction = async (data: Partial<ITransaction>, userId: string) => {
  return transactionRepository.create(data, userId);
};

export const updateTransaction = async (
  id: string,
  data: Partial<ITransaction>,
  userId: string
) => {
  return transactionRepository.update(id, data, userId);
};

export const deleteTransaction = async (id: string, userId: string) => {
  return transactionRepository.remove(id, userId);
};
