import { Response, Request } from 'express';
import { deleteUserCompletely } from '../services/userService';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

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
