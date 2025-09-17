import * as transactionRepository from '../repositories/transactionRepository';
import { ITransaction } from '../models/Transaction';

export const getTransactions = async () => {
  return transactionRepository.findAll();
};

export const getTransactionById = async (id: string) => {
  return transactionRepository.findById(id);
};

export const createTransaction = async (data: ITransaction) => {
  if (!data.name || !data.amount) {
    throw new Error('Name and amount are required');
  }
  return transactionRepository.create(data);
};

export const updateTransaction = async (id: string, data: Partial<ITransaction>) => {
  return transactionRepository.update(id, data);
};

export const deleteTransaction = async (id: string) => {
  return transactionRepository.remove(id);
};
