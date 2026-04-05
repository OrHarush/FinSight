import { CreateAccountDTO, fromCents, toCents, UpdateAccountDTO } from '@lyra/shared';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { IAccount } from '../models/Account';
import * as accountRepository from '../repositories/accountRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { setBalanceCheckpoint } from './balanceService';

export const findAll = async (userId: string) => {
  const accounts = await accountRepository.findMany(userId);

  return accounts.map(a => ({ ...a, balance: fromCents(a.balance) }));
};

export const getAccountById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const account = await accountRepository.findById(id, userId);

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  return { ...account, balance: fromCents(account.balance) };
};

export const create = async (data: CreateAccountDTO, userId: string) => {
  const numOfAccounts = await accountRepository.countByUser(userId);

  const mapped: Omit<IAccount, '_id'> = {
    name: data.name,
    balance: toCents(data.balance),
    institution: data.institution,
    accountNumber: data.accountNumber,
    icon: data.icon,
    currency: data.currency ?? 'ILS',
    isPrimary: numOfAccounts === 0 ? true : (data.isPrimary ?? false),
    userId: new Types.ObjectId(userId),
  };

  if (mapped.isPrimary && numOfAccounts > 0) {
    await accountRepository.unsetPrimary(userId);
  }

  const created = await accountRepository.insert(mapped);

  created.balance = fromCents(created.balance);

  return created;
};

export const update = async (id: string, data: UpdateAccountDTO, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const existing = await accountRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Account not found');
  }

  if (typeof data.balance === 'number') {
    await setBalanceCheckpoint(userId, id, data.balance);
  }

  const { balance: _stripped, ...rest } = data as UpdateAccountDTO & { balance?: number };
  const mapped: Partial<IAccount> = { ...rest };

  const updated = await accountRepository.updateById(id, mapped, userId);

  if (!updated) {
    throw ApiError.internal('Unexpected error updating account');
  }

  return { ...updated, balance: fromCents(updated.balance) };
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

  const updated = await accountRepository.updateById(id, { isPrimary: true }, userId);

  if (!updated) {
    throw ApiError.internal('Unexpected error setting primary account');
  }

  return { ...updated, balance: fromCents(updated.balance) };
};

export const deleteAccount = async (id: string, userId: string, replacementId?: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid account ID');
  }

  const account = await accountRepository.findById(id, userId);

  if (!account) {
    throw ApiError.notFound('Account not found');
  }

  const totalCount = await accountRepository.countByUser(userId);

  if (totalCount <= 1) {
    throw ApiError.badRequest('Cannot delete the only account');
  }

  const txCount = await transactionRepository.countByAccountId(userId, id);

  if (txCount > 0) {
    if (replacementId) {
      if (!mongoose.Types.ObjectId.isValid(replacementId)) {
        throw ApiError.badRequest('Invalid replacement account ID');
      }

      await transactionRepository.reassignAccount(userId, id, replacementId);
    } else if (totalCount === 2) {
      const other = await accountRepository.findAnother(userId, id);

      if (other) {
        await transactionRepository.reassignAccount(userId, id, other._id.toString());
      }
    } else {
      throw ApiError.badRequest('Replacement account is required when transactions exist');
    }
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
