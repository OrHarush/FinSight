import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as monthlyReportService from '../services/monthlyReportService';

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

export const getEligibility = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  if (!req.workspaceId) {
    throw ApiError.unauthorized('Workspace context required');
  }

  const { month } = req.query;

  if (!month || typeof month !== 'string' || !MONTH_PATTERN.test(month)) {
    throw ApiError.badRequest('month query param must be in YYYY-MM format');
  }

  const result = await monthlyReportService.getEligibility(req.userId, req.workspaceId, month);

  return ApiResponse.ok(res, result);
});

export const markSeen = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const { month } = req.body;

  if (!month || typeof month !== 'string' || !MONTH_PATTERN.test(month)) {
    throw ApiError.badRequest('month must be in YYYY-MM format');
  }

  await monthlyReportService.markSeen(req.userId, month);

  return ApiResponse.ok(res, { message: 'Monthly report marked as seen' });
});
