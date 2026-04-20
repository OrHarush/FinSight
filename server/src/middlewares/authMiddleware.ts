import { NextFunction, Request, Response } from 'express';

import { extractUserDataFromBearerToken } from '../auth/jwt';
import { ApiError } from '../errors/ApiError';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  try {
    const userData = extractUserDataFromBearerToken(authHeader);
    req.userId = userData.userId;
    req.userRole = userData.role;

    return next();
  } catch {
    return next(ApiError.unauthorized('Unauthorized'));
  }
};
