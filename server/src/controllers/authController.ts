import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import { acceptTermsService, loginAsDevUser, loginWithGoogle } from '../services/authService';
import { getCurrentUserById } from '../services/userService';

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUserById(req.userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return ApiResponse.ok(res, user);
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginWithGoogle(req.body.token);

  return res.json(result);
});

export const devLogin = asyncHandler(async (_req: Request, res: Response) => {
  const result = await loginAsDevUser();

  return res.json(result);
});

export const acceptTerms = asyncHandler(async (req: Request, res: Response) => {
  const locale = req.body.locale || 'en';
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
  const userAgent = req.headers['user-agent'] || '';

  const updatedUser = await acceptTermsService({
    userId: req.userId,
    locale,
    ip,
    userAgent,
  });

  return ApiResponse.ok(res, {
    message: 'Terms accepted successfully',
    user: updatedUser,
  });
});
