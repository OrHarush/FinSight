import { Request, Response } from 'express';
import * as adminService from '../services/adminService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

export const getKpiOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await adminService.getKpiOverview();
  return ApiResponse.ok(res, overview);
});

export const getLoginEvents = asyncHandler(async (req: Request, res: Response) => {
  const days = Number(req.query.days ?? 7);

  if (Number.isNaN(days) || days <= 0) {
    return ApiError.badRequest('Days must be a positive number');
  }

  const events = await adminService.getLoginEvents(days);
  return ApiResponse.ok(res, events);
});
