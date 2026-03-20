import { CreateAccountDTO, UpdateAccountDTO } from '@finsight/shared';
import mongoose from 'mongoose';

import { ApiError } from '../errors/ApiError';
import * as accountRepository from '../repositories/accountRepository';
import * as transactionRepository from '../repositories/transactionRepository';

export const findAll = async (userId: string) => accountRepository.findMany(userId);

export const getAccountById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const account = await accountRepository.findById(id, userId);
  if (!account) throw ApiError.notFound('Account not found');

  return account;
};

export const create = async (accountDetails: CreateAccountDTO, userId: string) => {
  const numOfAccounts = await accountRepository.countByUser(userId);

  if (numOfAccounts === 0) {
    accountDetails.isPrimary = true;
  } else if (accountDetails.isPrimary) {
    await accountRepository.unsetPrimary(userId);
  }

  return accountRepository.insert(accountDetails, userId);
};

export const update = async (
  id: string,
  updatedAccountDetails: UpdateAccountDTO,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const existing = await accountRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Account not found');
  }

  const isBalanceProvided = typeof updatedAccountDetails.balance === 'number';
  const balanceChanged = isBalanceProvided && updatedAccountDetails.balance !== existing.balance;

  if (balanceChanged) {
    (updatedAccountDetails as any).lastSynced = new Date();
  }

  return accountRepository.updateById(id, updatedAccountDetails, userId);
};

export const setPrimary = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const account = await accountRepository.findById(id, userId);

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  await accountRepository.unsetPrimary(userId, id);

  return accountRepository.updateById(id, { isPrimary: true }, userId);
};

export const deleteAccount = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const account = await accountRepository.findById(id, userId);
  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  const deletedAccount = await accountRepository.remove(id, userId);

  if (!deletedAccount) {
    throw ApiError.internal('Unexpected error deleting account');
  }

  if (deletedAccount.isPrimary) {
    const newPrimary = await accountRepository.findAnother(userId);
    if (newPrimary) {
      await accountRepository.updateById(newPrimary._id.toString(), { isPrimary: true }, userId);
    }
  }

  return deletedAccount;
};

export const getLinkedTransactionsCount = async (userId: string, accountId: string) => {
  if (!mongoose.Types.ObjectId.isValid(accountId)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const account = await accountRepository.findById(accountId, userId);

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  return transactionRepository.countByAccountId(userId, accountId);
};
