import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { runBalanceSyncJob } from '../jobs/balanceSyncJob';
import { runRecurringTransactionsJob } from '../jobs/recurringTransactionsJob';
import { runForDebugUser } from '../jobs/runForDebugUserJob';
import { asyncHandler } from '../middlewares/asyncHandler';

export const runRecurringTransactions = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await runRecurringTransactionsJob();

  return ApiResponse.ok(res, summary);
});

export const runBalanceSync = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await runBalanceSyncJob();

  return ApiResponse.ok(res, summary);
});

export const runDebugForMe = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await runForDebugUser();

  return ApiResponse.ok(res, summary);
});
