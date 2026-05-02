import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { runBalanceBreakdownJob } from '../jobs/balanceBreakdownJob';
import { restoreDebugSnapshot } from '../jobs/restoreDebugSnapshotJob';
import { runForDebugUser } from '../jobs/runForDebugUserJob';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as debugSnapshotRepository from '../repositories/debugSnapshotRepository';
import * as adminService from '../services/adminService';

export const getKpiOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await adminService.getKpiOverview();

  return ApiResponse.ok(res, overview);
});

export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const analytics = await adminService.getAnalytics();

  return ApiResponse.ok(res, analytics);
});

export const getLoginEvents = asyncHandler(async (req: Request, res: Response) => {
  const days = Number(req.query.days ?? 7);

  if (Number.isNaN(days) || days <= 0) {
    throw ApiError.badRequest('Days must be a positive number');
  }

  const events = await adminService.getLoginEvents(days);

  return ApiResponse.ok(res, events);
});

export const runDebugForMe = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await runForDebugUser();

  return ApiResponse.ok(res, summary);
});

export const restoreDebugForMe = asyncHandler(async (req: Request, res: Response) => {
  const snapshotId =
    typeof req.body?.snapshotId === 'string' ? req.body.snapshotId : undefined;

  const summary = await restoreDebugSnapshot({ snapshotId });

  return ApiResponse.ok(res, summary);
});

export const getDebugSnapshots = asyncHandler(async (req: Request, res: Response) => {
  const snapshots = await debugSnapshotRepository.findManyByUser(req.userId, 20);

  return ApiResponse.ok(res, snapshots);
});

export const getBalanceBreakdown = asyncHandler(async (req: Request, res: Response) => {
  const accountId =
    typeof req.query.accountId === 'string' ? req.query.accountId : undefined;

  const result = await runBalanceBreakdownJob({ accountId });

  return ApiResponse.ok(res, result);
});
