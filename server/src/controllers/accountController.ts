import { CreateAccountDTO, UpdateAccountDTO } from '@finsight/shared';
import { Request, Response } from 'express';

import * as accountService from '../services/accountService';
import * as balanceService from '../services/balanceService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
  const accounts = await accountService.findAll(req.userId);

  return ApiResponse.ok(res, accounts);
});

export const getAccountById = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountService.getAccountById(req.params.id as string, req.userId);

  return ApiResponse.ok(res, account);
});

export const getAccountBalanceCurve = asyncHandler(async (req: Request, res: Response) => {
  const { id: accountId } = req.params;
  const { from, to } = req.query;

  const data = await balanceService.calculateAccountBalanceCurve(
    req.userId,
    accountId as string,
    from as string | undefined,
    to as string | undefined
  );

  return ApiResponse.ok(res, data);
});

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountService.create(req.validatedBody as CreateAccountDTO, req.userId);

  return ApiResponse.created(res, account);
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const updated = await accountService.update(
    req.params.id as string,
    req.validatedBody as UpdateAccountDTO,
    req.userId
  );

  return ApiResponse.ok(res, updated);
});

export const setPrimaryAccount = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountService.setPrimary(req.params.id as string, req.userId);

  return ApiResponse.ok(res, account);
});

export const syncAccountBalance = asyncHandler(async (req: Request, res: Response) => {
  const result = await balanceService.syncAccountBalance(req.userId, req.params.id as string);

  return ApiResponse.ok(res, result);
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  await accountService.deleteAccount(req.params.id as string, req.userId, req.body.replacementId as string | undefined);

  return ApiResponse.deleted(res, 'Account deleted');
});

export const getLinkedTransactionsCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await accountService.getLinkedTransactionsCount(
    req.userId,
    req.params.id as string
  );

  return ApiResponse.ok(res, { count });
});
