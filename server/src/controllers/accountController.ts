import { Request, Response } from 'express';
import * as accountService from '../services/accountService';
import { calculateAccountBalanceCurve } from '../services/balanceService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
  const accounts = await accountService.findAll(req.userId);

  return ApiResponse.ok(res, accounts);
});

export const getAccountById = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountService.getAccountById(req.params.id, req.userId);

  return ApiResponse.ok(res, account);
});

export const getAccountBalanceCurve = asyncHandler(async (req: Request, res: Response) => {
  const { id: accountId } = req.params;
  const { from, to } = req.query;

  const data = await calculateAccountBalanceCurve(
    req.userId,
    accountId,
    from as string | undefined,
    to as string | undefined
  );

  return ApiResponse.ok(res, data);
});

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountService.create(req.body, req.userId);

  return ApiResponse.created(res, account);
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const updated = await accountService.update(req.params.id, req.body, req.userId);

  return ApiResponse.ok(res, updated);
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  await accountService.deleteAccount(req.params.id, req.userId);

  return ApiResponse.deleted(res, 'Account deleted');
});

export const getLinkedTransactionsCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await accountService.getLinkedTransactionsCount(req.userId, req.params.id);

  return ApiResponse.ok(res, { count });
});
