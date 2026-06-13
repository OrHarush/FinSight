import { Types } from 'mongoose';

import { ApiError } from '../../errors/ApiError';
import Category from '../../models/Category';
import { TransactionSource } from '../../models/Transaction';
import * as accountRepository from '../../repositories/accountRepository';
import * as paymentMethodRepository from '../../repositories/paymentMethodRepository';
import * as merchantRulesService from '../merchantRulesService';
import { findPersonalWorkspaceIdForUser } from '../workspaceService';
import * as transactionService from './transactionService';

interface AutomationTransactionInput {
  userId: string;
  source: TransactionSource;
  rawTitle: string;
  amount: number;
  date?: string;
}

const findExistingCategoryId = async (
  categoryId: Types.ObjectId | null | undefined,
  workspaceId: string
): Promise<string | undefined> => {
  if (!categoryId) {
    return undefined;
  }

  const category = await Category.findOne({
    _id: categoryId,
    workspaceId: new Types.ObjectId(workspaceId),
  });

  return category ? category._id.toString() : undefined;
};

export const createAutomationTransaction = async ({
  userId,
  source,
  rawTitle,
  amount,
  date,
}: AutomationTransactionInput) => {
  const personalWorkspaceId = await findPersonalWorkspaceIdForUser(userId);

  if (!personalWorkspaceId) {
    throw ApiError.internal('No personal workspace found for user');
  }

  const workspaceId = personalWorkspaceId.toString();

  const primaryAccount = await accountRepository.findPrimary(workspaceId);

  if (!primaryAccount) {
    throw ApiError.badRequest('No primary account found for this workspace');
  }

  const primaryPaymentMethod = await paymentMethodRepository.findPrimary(workspaceId);

  const rule = await merchantRulesService.lookupRule(userId, rawTitle);
  const name = rule?.alias ?? rawTitle;
  const categoryId = await findExistingCategoryId(rule?.categoryId, workspaceId);

  return transactionService.create(
    {
      type: 'Expense',
      amount,
      date: date ?? new Date().toISOString(),
      name,
      accountId: primaryAccount._id.toString(),
      paymentMethodId: primaryPaymentMethod?._id.toString(),
      categoryId,
    },
    userId,
    workspaceId,
    source,
    rawTitle
  );
};
