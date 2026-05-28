import { ApiError } from '../errors/ApiError';
import { IUser } from '../models/User';
import * as accountRepository from '../repositories/accountRepository';
import * as budgetRepository from '../repositories/budgetRepository';
import * as categoryRepository from '../repositories/categoryRepository';
import * as goalRepository from '../repositories/goalRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as recurringTemplateRepository from '../repositories/recurringTemplateRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import * as userRepository from '../repositories/userRepository';
import { getActiveWorkspaceIdOrThrow } from './workspaceService';

const EXPORT_VERSION = '1.0' as const;

export interface ExportedUser {
  email: string;
  name: string;
  displayCurrency: string;
  createdAt: Date | undefined;
  acceptedTermsAt: Date | null;
  acceptedPrivacyAt: Date | null;
  consentVersion: string | undefined;
  consentLocale: string | undefined;
  hasCompletedOnboarding: boolean;
  analyticsConsent: IUser['analyticsConsent'];
}

export interface UserExport {
  exportedAt: string;
  exportVersion: typeof EXPORT_VERSION;
  user: ExportedUser;
  accounts: unknown[];
  categories: unknown[];
  paymentMethods: unknown[];
  transactions: unknown[];
  recurringTemplates: unknown[];
  budgets: unknown[];
  goals: unknown[];
}

const pickExportedUserFields = (user: IUser): ExportedUser => ({
  email: user.email,
  name: user.name,
  displayCurrency: user.displayCurrency,
  createdAt: user.createdAt,
  acceptedTermsAt: user.acceptedTermsAt,
  acceptedPrivacyAt: user.acceptedPrivacyAt,
  consentVersion: user.consentVersion,
  consentLocale: user.consentLocale,
  hasCompletedOnboarding: user.hasCompletedOnboarding,
  analyticsConsent: user.analyticsConsent,
});

const stripOpsFields = (doc: object): Record<string, unknown> => {
  const { userId: _userId, __v: _v, ...rest } = doc as Record<string, unknown>;

  return rest;
};

// TODO: if any single user exceeds ~50,000 transactions, switch to streaming
// (e.g. JSONStream.stringify + res.write) instead of buffering the whole export.
export const buildExport = async (userId: string): Promise<UserExport> => {
  // export is the only userId-keyed entry point; resolve workspaceId once and use it for everything except budgets,
  // which still has a userId-only `findAllByUser` helper (export is its single caller).
  const workspaceId = (await getActiveWorkspaceIdOrThrow(userId)).toString();

  const [
    user,
    accounts,
    categories,
    paymentMethods,
    transactions,
    recurringTemplates,
    budgets,
    goals,
  ] = await Promise.all([
    userRepository.findById(userId),
    accountRepository.findMany(workspaceId),
    categoryRepository.findMany(workspaceId),
    paymentMethodRepository.findMany(workspaceId),
    transactionRepository.findAllByWorkspace(workspaceId),
    recurringTemplateRepository.findMany(workspaceId),
    budgetRepository.findAllByUser(userId),
    goalRepository.findMany(workspaceId),
  ]);

  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  const userObject = user.toObject() as IUser;

  return {
    exportedAt: new Date().toISOString(),
    exportVersion: EXPORT_VERSION,
    user: pickExportedUserFields(userObject),
    accounts: accounts.map(stripOpsFields),
    categories: categories.map(stripOpsFields),
    paymentMethods: paymentMethods.map(stripOpsFields),
    transactions: transactions.map(stripOpsFields),
    recurringTemplates: recurringTemplates.map(stripOpsFields),
    budgets: budgets.map(stripOpsFields),
    goals: goals.map(stripOpsFields),
  };
};
