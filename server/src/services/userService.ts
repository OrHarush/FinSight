import { toCents } from '@lyra/shared';
import mongoose, { Types } from 'mongoose';

import {
  DEFAULT_ACCOUNT,
  DEFAULT_CATEGORIES,
  DEFAULT_PAYMENT_METHODS,
} from '../constants/defaultEntities';
import { IAccount } from '../models/Account';
import { ICategory } from '../models/Category';
import { DeletionReason, IDeletionFeedback } from '../models/DeletionFeedback';
import { IPaymentMethod } from '../models/PaymentMethod';
import { IUser } from '../models/User';
import { deleteMany as deleteAccounts } from '../repositories/accountRepository';
import * as accountRepository from '../repositories/accountRepository';
import { deleteMany as deleteBudgets } from '../repositories/budgetRepository';
import {
  deleteMany as deleteCategories,
  insertMany as createCategories,
} from '../repositories/categoryRepository';
import * as deletionFeedbackRepository from '../repositories/deletionFeedbackRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import { deleteMany as deleteTransactions } from '../repositories/transactionRepository';
import {
  deleteUserById,
  findById,
  updateOnboarding,
  updatePreferences as updatePreferencesRepo,
} from '../repositories/userRepository';
import * as analyticsService from './analyticsService';

export interface DeletionFeedbackInput {
  reason?: DeletionReason | null;
  comment?: string | null;
  locale: 'he' | 'en';
}

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

  const defaultBalanceCents = toCents(DEFAULT_ACCOUNT.balance ?? 0);

  const defaultAccount: Omit<IAccount, '_id'> = {
    name: DEFAULT_ACCOUNT.name,
    balance: defaultBalanceCents,
    checkpointBalance: defaultBalanceCents,
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

const MS_PER_DAY = 86_400_000;

const buildDeletionSnapshot = (
  user: IUser,
  feedback?: DeletionFeedbackInput
): Partial<IDeletionFeedback> => {
  const createdAt = user.createdAt ?? new Date();
  const daysSinceSignup = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / MS_PER_DAY));
  const trimmedComment = feedback?.comment?.trim();

  return {
    reason: feedback?.reason ?? null,
    comment: trimmedComment ? trimmedComment : null,
    transactionCount: user.totalTransactions ?? 0,
    daysSinceSignup,
    hadCompletedOnboarding: !!user.hasCompletedOnboarding,
    locale: feedback?.locale ?? 'he',
  };
};

const recordDeletionFeedback = async (userId: string, feedback?: DeletionFeedbackInput) => {
  try {
    const user = await findById(userId);

    if (!user) {
      return;
    }

    const snapshot = buildDeletionSnapshot(user, feedback);
    await deletionFeedbackRepository.insert(snapshot);
  } catch (err) {
    console.error('Failed to record deletion feedback:', err);
  }
};

export const deleteUserCompletely = async (userId: string, feedback?: DeletionFeedbackInput) => {
  await recordDeletionFeedback(userId, feedback);

  void analyticsService.track(userId, 'user_deleted').catch(err =>
    console.error('Failed to track user_deleted:', err)
  );

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
