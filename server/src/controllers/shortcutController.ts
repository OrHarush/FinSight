import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as accountRepository from '../repositories/accountRepository';
import { ApproveDTO, ShortcutTransactionDTO } from '../schemas/shortcutSchemas';
import * as shortcutService from '../services/shortcutService';
import * as transactionService from '../services/transactions/transactionService';
import { resolveWorkspaceForRequest } from '../services/workspaceService';

const toDisplayName = (category: shortcutService.ShortcutCategory) => {
  if (!category.workspaceName || category.isPersonal) {
    return category.name;
  }

  return `${category.name} (${category.workspaceName})`;
};

export const initShortcut = asyncHandler(async (req: Request, res: Response) => {
  const code = await shortcutService.createCode(req.userId);

  return ApiResponse.ok(res, { code });
});

export const approveShortcut = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.validatedBody as ApproveDTO;
  await shortcutService.approveCode(code, req.userId);

  return ApiResponse.ok(res, { approved: true });
});

export const getShortcutStatus = asyncHandler(async (req: Request, res: Response) => {
  const token = (req.headers.authorization ?? '').slice('Shortcut '.length).trim();
  const { connectedAt } = shortcutService.getShortcutConnection(token);

  return ApiResponse.ok(res, { connected: true, connectedAt });
});

export const revokeShortcut = asyncHandler(async (req: Request, res: Response) => {
  await shortcutService.revokeAllForUser(req.userId);

  return ApiResponse.ok(res, { revoked: true });
});

export const getShortcutToken = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const token = await shortcutService.exchangeToken(code);

  if (token === null) {
    return res.status(202).json({ success: true, status: 'pending' });
  }

  return ApiResponse.ok(res, { token });
});

export const getShortcutCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await shortcutService.getShortcutCategories(req.userId);

  return ApiResponse.ok(res, {
    categories: categories.map(category => ({
      id: category.id,
      name: toDisplayName(category),
    })),
  });
});

export const createShortcutTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { amount, merchant, date, categoryId, note } = req.validatedBody as ShortcutTransactionDTO;

  const workspaceId = categoryId
    ? await shortcutService.resolveWorkspaceForCategory(req.userId, categoryId)
    : (await resolveWorkspaceForRequest(req.userId)).toString();

  const primary = await accountRepository.findPrimary(workspaceId);

  if (!primary) {
    throw ApiError.badRequest('No primary account found for this workspace');
  }

  const result = await transactionService.create(
    {
      type: 'Expense',
      amount,
      date,
      categoryId,
      note,
      name: merchant,
      accountId: primary._id.toString(),
    },
    req.userId,
    workspaceId
  );

  return ApiResponse.created(res, { id: result.transaction._id });
});
