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

export const getFeedbackSurveyEligibility = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  const result = await feedbackService.getSurveyEligibility(req.userId);

  return ApiResponse.ok(res, result);
});

export const markFeedbackSurveySeen = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized('Unauthorized');
  }

  await feedbackService.markSurveySeen(req.userId);

  return ApiResponse.ok(res, { message: 'Survey marked as seen' });
});
