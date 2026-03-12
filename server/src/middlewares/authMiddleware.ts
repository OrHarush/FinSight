import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { extractUserDataFromBearerToken } from '../utils/auth';

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
