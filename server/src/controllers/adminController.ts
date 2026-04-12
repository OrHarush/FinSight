import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
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
