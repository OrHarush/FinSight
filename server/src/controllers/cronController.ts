import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { runBalanceSyncJob } from '../jobs/balanceSyncJob';
import { runDebugUserJobs } from '../jobs/debugUserJobsJob';
import { runRecurringTransactionsJob } from '../jobs/recurringTransactionsJob';
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
  const summary = await runDebugUserJobs();

  return ApiResponse.ok(res, summary);
});
