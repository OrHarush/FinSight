import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import {
  CompleteOnboardingBody,
  DeleteUserBody,
  UpdateAnalyticsConsentBody,
  UpdatePreferencesBody,
} from '../schemas/userSchemas';
import {
  completeOnboarding,
  deleteUserCompletely,
  updateAnalyticsConsent,
  updatePreferences,
} from '../services/userService';

export const completeOnboardingController = asyncHandler(async (req: Request, res: Response) => {
  const { billingDay } = req.validatedBody as CompleteOnboardingBody;
  const user = await completeOnboarding(req.userId!, billingDay);

  return ApiResponse.ok(res, user);
});

export const updatePreferencesController = asyncHandler(async (req: Request, res: Response) => {
  const { displayCurrency } = req.validatedBody as UpdatePreferencesBody;
  const user = await updatePreferences(req.userId!, displayCurrency);

  return ApiResponse.ok(res, user);
});

export const updateAnalyticsConsentController = asyncHandler(
  async (req: Request, res: Response) => {
    const { analyticsConsent } = req.validatedBody as UpdateAnalyticsConsentBody;
    const user = await updateAnalyticsConsent(req.userId!, analyticsConsent);

    return ApiResponse.ok(res, user);
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (userId !== req.userId) {
    throw ApiError.forbidden('Not authorized to delete this user.');
  }

  const { feedback } = (req.validatedBody ?? {}) as DeleteUserBody;
  const result = await deleteUserCompletely(userId, feedback);

  return ApiResponse.ok(res, {
    message: 'User and all related data deleted successfully.',
    result,
  });
});
