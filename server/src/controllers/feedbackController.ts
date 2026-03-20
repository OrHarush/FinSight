import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import * as feedbackService from '../services/feedbackService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  await feedbackService.submit(req.body, req.userId);

  return ApiResponse.ok(res, { message: 'Feedback submitted successfully' });
});
