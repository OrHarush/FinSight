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
  deleteMany as deleteCategories,
  insertMany as createCategories,
} from '../repositories/categoryRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import { deleteMany as deleteTransactions } from '../repositories/transactionRepository';
import {
  deleteUserById,
  findById,
  updateOnboarding,
  updatePreferences as updatePreferencesRepo,
} from '../repositories/userRepository';
import * as analyticsService from './analyticsService';

export const getCurrentUserById = async (userId: string) => findById(userId);

export const updatePreferences = async (userId: string, displayCurrency: string) =>
  updatePreferencesRepo(userId, displayCurrency);

export const createDefaultEntitiesForNewUser = async (userId: string) => {
  const categoriesToCreate: Omit<ICategory, '_id'>[] = DEFAULT_CATEGORIES.map(dto => ({
    key: dto.key,
    name: dto.name,
    type: dto.type,
    color: dto.color ?? '#9ca3af',
    icon: dto.icon ?? '',
    userId: new Types.ObjectId(userId),
  }));

  const paymentMethodsToCreate: Omit<IPaymentMethod, '_id'>[] = DEFAULT_PAYMENT_METHODS.map(
    dto => ({
      name: dto.name,
      type: dto.type,
      billingDay: dto.billingDay ?? null,
      lastFourDigits: dto.lastFourDigits,
      isPrimary: dto.isPrimary ?? false,
      key: dto.key,
      userId: new Types.ObjectId(userId),
    })
  );

  const defaultAccount: Omit<IAccount, '_id'> = {
    name: DEFAULT_ACCOUNT.name,
    balance: DEFAULT_ACCOUNT.balance ?? 0,
    checkpointBalance: DEFAULT_ACCOUNT.balance ?? 0,
    checkpointDate: new Date(),
    institution: DEFAULT_ACCOUNT.institution,
    accountNumber: DEFAULT_ACCOUNT.accountNumber,
    icon: DEFAULT_ACCOUNT.icon,
    currency: DEFAULT_ACCOUNT.currency ?? 'ILS',
    isPrimary: true,
    key: DEFAULT_ACCOUNT.key,
    userId: new Types.ObjectId(userId),
  };

  await Promise.all([
    createCategories(categoriesToCreate),
    paymentMethodRepository.insertMany(paymentMethodsToCreate),
    accountRepository.insert(defaultAccount),
  ]);
};

export const completeOnboarding = async (userId: string, billingDay?: number) => {
  if (billingDay !== undefined) {
    const creditCard = await paymentMethodRepository.findByType(userId, 'Credit Card');

    if (creditCard) {
      await paymentMethodRepository.updateById(creditCard._id.toString(), { billingDay }, userId);
    }
  }

  const result = await updateOnboarding(userId);

  void analyticsService.track(userId, 'onboarding_completed').catch(err =>
    console.error('Failed to track onboarding_completed:', err)
  );

  return result;
};

export const deleteUserCompletely = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await deleteTransactions({ userId: userId }, session);
    await deleteAccounts({ userId: userId }, session);
    await deleteCategories({ userId: userId }, session);
    await paymentMethodRepository.deleteMany({ userId: userId }, session);
    await deleteBudgets({ userId: userId }, session);
    await deleteUserById(userId, session);

    await session.commitTransaction();
    await session.endSession();

    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};
