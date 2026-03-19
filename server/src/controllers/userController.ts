import { Response, Request } from 'express';
import { deleteUserCompletely, updatePreferences } from '../services/userService';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { UpdatePreferencesBody } from '../schemas/userSchemas';

export const updatePreferencesController = asyncHandler(async (req: Request, res: Response) => {
  const { displayCurrency } = req.validatedBody as UpdatePreferencesBody;
  const user = await updatePreferences(req.userId!, displayCurrency);

  return ApiResponse.ok(res, user);
});

export const deleteUserController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (userId !== req.userId) {
    throw ApiError.forbidden('Not authorized to delete this user.');
  }

  const result = await deleteUserCompletely(userId);

  return ApiResponse.ok(res, {
    message: 'User and all related data deleted successfully.',
    result,
  });
});
