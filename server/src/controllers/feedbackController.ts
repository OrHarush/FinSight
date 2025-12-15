import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import * as feedbackService from '../services/feedbackService';

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  await feedbackService.submit(req.body, req.userId);

  return ApiResponse.deleted(res);
});
