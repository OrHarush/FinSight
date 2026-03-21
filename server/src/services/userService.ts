import mongoose, { Types } from 'mongoose';

import {
  DEFAULT_ACCOUNT,
  DEFAULT_CATEGORIES,
  DEFAULT_PAYMENT_METHODS,
} from '../constants/defaultEntities';
import { IAccount } from '../models/Account';
import { ICategory } from '../models/Category';
import { IPaymentMethod } from '../models/PaymentMethod';
import { deleteMany as deleteAccounts } from '../repositories/accountRepository';
import * as accountRepository from '../repositories/accountRepository';
import { deleteMany as deleteBudgets } from '../repositories/budgetRepository';
import {
  insertMany as createCategories,
  deleteMany as deleteCategories,
} from '../repositories/categoryRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import { deleteMany as deleteTransactions } from '../repositories/transactionRepository';
import {
  deleteUserById,
  findById,
  updatePreferences as updatePreferencesRepo,
} from '../repositories/userRepository';

export const getCurrentUserById = async (userId: string) => findById(userId);

export const updatePreferences = async (userId: string, displayCurrency: string) =>
  updatePreferencesRepo(userId, displayCurrency);

export const createDefaultEntitiesForNewUser = async (userId: string) => {
  const categoriesToCreate: Omit<ICategory, '_id'>[] = DEFAULT_CATEGORIES.map((dto) => ({
    key: dto.key,
    name: dto.name,
    type: dto.type,
    color: dto.color ?? '#9ca3af',
    icon: dto.icon ?? '',
    userId: new Types.ObjectId(userId),
  }));

  const paymentMethodsToCreate: Omit<IPaymentMethod, '_id'>[] = DEFAULT_PAYMENT_METHODS.map(
    (dto) => ({
      name: dto.name,
      type: dto.type,
      billingDay: dto.billingDay ?? null,
      lastFourDigits: dto.lastFourDigits,
      isPrimary: dto.isPrimary ?? false,
      userId: new Types.ObjectId(userId),
    })
  );

  const defaultAccount: Omit<IAccount, '_id'> = {
    name: DEFAULT_ACCOUNT.name,
    balance: DEFAULT_ACCOUNT.balance ?? 0,
    institution: DEFAULT_ACCOUNT.institution,
    accountNumber: DEFAULT_ACCOUNT.accountNumber,
    icon: DEFAULT_ACCOUNT.icon,
    currency: DEFAULT_ACCOUNT.currency ?? 'ILS',
    isPrimary: true,
    userId: new Types.ObjectId(userId),
  };

  await Promise.all([
    createCategories(categoriesToCreate),
    paymentMethodRepository.insertMany(paymentMethodsToCreate),
    accountRepository.insert(defaultAccount),
  ]);
};

export const deleteUserCompletely = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Promise.all([
      deleteTransactions({ userId: userId }),
      deleteAccounts({ userId: userId }),
      deleteCategories({ userId: userId }),
      paymentMethodRepository.deleteMany({ userId: userId }),
      deleteBudgets({ userId: userId }),
    ]);

    await deleteUserById(userId);

    await session.commitTransaction();
    await session.endSession();

    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};
