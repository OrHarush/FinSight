import { Request, Response } from 'express';

import { acceptTermsService, googleLoginService } from '../services/authService';
import { getCurrentUserById } from '../services/userService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUserById(req.userId);

  return ApiResponse.ok(res, user);
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await googleLoginService(req.body.token);

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
