import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { runRecurringTransactionsJob } from '../jobs/recurringTransactionsJob';
import { asyncHandler } from '../middlewares/asyncHandler';

export const runRecurringTransactions = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await runRecurringTransactionsJob();

  return ApiResponse.ok(res, summary);
});
