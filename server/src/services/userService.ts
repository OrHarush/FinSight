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
import * as analyticsEventRepository from '../repositories/analyticsEventRepository';
import { deleteMany as deleteBudgets } from '../repositories/budgetRepository';
import {
  deleteMany as deleteCategories,
  insertMany as createCategories,
} from '../repositories/categoryRepository';
import { deleteMany as deleteDebugSnapshots } from '../repositories/debugSnapshotRepository';
import * as deletionFeedbackRepository from '../repositories/deletionFeedbackRepository';
import { deleteMany as deleteGoals } from '../repositories/goalRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import { deleteMany as deleteRecurringTemplates } from '../repositories/recurringTemplateRepository';
import {
  countByUser,
  deleteMany as deleteTransactions,
} from '../repositories/transactionRepository';
import * as userActivityRepository from '../repositories/userActivityRepository';
import {
  deleteUserById,
  findById,
  updateAnalyticsConsent as updateAnalyticsConsentRepo,
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

export const updateAnalyticsConsent = async (
  userId: string,
  analyticsConsent: 'accepted' | 'rejected'
) => updateAnalyticsConsentRepo(userId, analyticsConsent);

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
  transactionCount: number,
  feedback?: DeletionFeedbackInput
): Partial<IDeletionFeedback> => {
  const createdAt = user.createdAt ?? new Date();
  const daysSinceSignup = Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / MS_PER_DAY));
  const trimmedComment = feedback?.comment?.trim();

  return {
    reason: feedback?.reason ?? null,
    comment: trimmedComment ? trimmedComment : null,
    transactionCount,
    daysSinceSignup,
    hadCompletedOnboarding: !!user.hasCompletedOnboarding,
    locale: feedback?.locale ?? 'he',
  };
};

const recordDeletionFeedback = async (user: IUser, feedback?: DeletionFeedbackInput) => {
  try {
    const transactionCount = await countByUser(user._id);
    const snapshot = buildDeletionSnapshot(user, transactionCount, feedback);
    await deletionFeedbackRepository.insert(snapshot);
  } catch (err) {
    console.error('Failed to record deletion feedback:', err);
  }
};

export const deleteUserCompletely = async (userId: string, feedback?: DeletionFeedbackInput) => {
  const user = await findById(userId);

  if (!user) {
    return { success: true };
  }

  await recordDeletionFeedback(user, feedback);

  const analyticsSnapshot = await analyticsService.captureUserSnapshot(userId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await deleteTransactions({ userId }, session);
    await deleteRecurringTemplates({ userId }, session);
    await deleteBudgets({ userId }, session);
    await deleteGoals({ userId }, session);
    await deleteAccounts({ userId }, session);
    await deleteCategories({ userId }, session);
    await paymentMethodRepository.deleteMany({ userId }, session);
    await deleteDebugSnapshots({ userId }, session);
    await userActivityRepository.anonymizeByUser(userId, session);
    await analyticsEventRepository.anonymizeByUserName(user.name, session);
    await deleteUserById(userId, session);

    await session.commitTransaction();
    await session.endSession();

    if (analyticsSnapshot) {
      void analyticsService
        .trackWithSnapshot('user_deleted', analyticsSnapshot)
        .catch(err => console.error('Failed to track user_deleted:', err));
    }

    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};
