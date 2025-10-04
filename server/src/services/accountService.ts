import * as accountRepository from '../repositories/accountRepository';
import { CreateAccountCommand, UpdateAccountCommand } from '@shared/types/AccountCommands';
import { Types } from 'mongoose';

export const getAccounts = async (userId: string) => accountRepository.findAll(userId);

export const getAccountById = async (id: string, userId: string) =>
  accountRepository.findById(id, userId);

export const createAccount = async (accountDetails: CreateAccountCommand, userId: string) => {
  if (!accountDetails.name) {
    throw new Error('Account name is required');
  }

  if (accountDetails.balance === undefined || accountDetails.balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  const numOfAccounts = await accountRepository.countByUser(userId);

  if (numOfAccounts === 0) {
    accountDetails.isPrimary = true;
  } else if (accountDetails.isPrimary) {
    await accountRepository.unsetPrimary(userId);
  }

  return accountRepository.create(accountDetails, userId);
};

export const updateAccount = async (
  id: string,
  updatedAccountDetails: UpdateAccountCommand,
  userId: string
) => {
  if (updatedAccountDetails.balance !== undefined && updatedAccountDetails.balance < 0) {
    throw new Error('Balance cannot be negative');
  }

  if (updatedAccountDetails.isPrimary) {
    await accountRepository.unsetPrimary(userId, id);
  } else {
    const account = await accountRepository.findById(id, userId);

    if (account?.isPrimary) {
      throw new Error('There must always be a primary account');
    }
  }

  return accountRepository.update(id, updatedAccountDetails, userId);
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
      await accountRepository.update(id, { isPrimary: true }, userId);
    }
  }

  return deletedAccount;
};
