import * as accountRepository from '../repositories/accountRepository';
import { IAccount } from '../models/Account';

export const getAccounts = async (userId: string) => {
  return accountRepository.findAll(userId);
};

export const getAccountById = async (id: string, userId: string) => {
  return accountRepository.findById(id, userId);
};

export const createAccount = async (data: Partial<IAccount>, userId: string) => {
  if (!data.name) {
    throw new Error('Account name is required');
  }

  if (data.balance !== undefined && data.balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  return accountRepository.create(data, userId);
};

export const updateAccount = async (id: string, data: Partial<IAccount>, userId: string) => {
  if (data.balance !== undefined && data.balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  return accountRepository.update(id, data, userId);
};

export const deleteAccount = async (id: string, userId: string) => {
  return accountRepository.remove(id, userId);
};
