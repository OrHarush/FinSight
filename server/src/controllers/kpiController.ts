import { Request, Response } from 'express';
import * as kpiService from '../services/kpiService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const getKpiOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await kpiService.getKpiOverview();

  return ApiResponse.ok(res, overview);
});
