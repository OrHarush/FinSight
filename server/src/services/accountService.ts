import * as accountRepository from '../repositories/accountRepository';
import { IAccount } from '../models/Account';

export const getAccounts = async () => {
  return accountRepository.findAll();
};

export const getAccountById = async (id: string) => {
  return accountRepository.findById(id);
};

export const createAccount = async (data: Partial<IAccount>) => {
  if (!data.name) {
    throw new Error('Account name is required');
  }

  if (data.balance !== undefined && data.balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  return accountRepository.create(data);
};

export const updateAccount = async (id: string, data: Partial<IAccount>) => {
  if (data.balance !== undefined && data.balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  return accountRepository.update(id, data);
};

export const deleteAccount = async (id: string) => {
  return accountRepository.remove(id);
};
