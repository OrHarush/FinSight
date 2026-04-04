import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as feedbackService from '../services/feedbackService';

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  await feedbackService.submit(req.body, req.userId);

  return ApiResponse.ok(res, { message: 'Feedback submitted successfully' });
});
