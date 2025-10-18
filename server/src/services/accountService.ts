import * as accountRepository from '../repositories/accountRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { CreateAccountCommand, UpdateAccountCommand } from '@shared/types/AccountCommands';
import { Types } from 'mongoose';

export const findAll = async (userId: string) => accountRepository.findMany(userId);

export const getAccountById = async (id: string, userId: string) =>
  accountRepository.findById(id, userId);

export const create = async (accountDetails: CreateAccountCommand, userId: string) => {
  if (!accountDetails.name) {
    throw new Error('Account name is required');
  }
  if (accountDetails.balance === undefined) {
    throw new Error('Balance is required');
  }

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
  updatedAccountDetails: UpdateAccountCommand,
  userId: string
) => {
  if (updatedAccountDetails.balance === undefined) {
    throw new Error('Balance is required');
  }

  if (updatedAccountDetails.isPrimary) {
    await accountRepository.unsetPrimary(userId, id);
  } else {
    const account = await accountRepository.findById(id, userId);

    if (account?.isPrimary) {
      throw new Error('There must always be a primary account');
    }
  }

  return accountRepository.updateById(id, updatedAccountDetails, userId);
};

export const deleteAccount = async (id: string, userId: string) => {
  const account = await accountRepository.findById(id, userId);

  if (!account) {
    return null;
  }

  const deletedAccount = await accountRepository.remove(id, userId);

  if (deletedAccount?.isPrimary) {
    const newPrimaryAccount = await accountRepository.findAnother(userId);

    if (newPrimaryAccount) {
      const id = (newPrimaryAccount._id as Types.ObjectId).toString();
      await accountRepository.updateById(id, { isPrimary: true }, userId);
    }
  }

  return deletedAccount;
};

export const getLinkedTransactionsCount = async (userId: string, accountId: string) => {
  const account = await accountRepository.findById(accountId, userId);

  if (!account) {
    return null;
  }

  return await transactionRepository.countByAccountId(userId, accountId);
};
