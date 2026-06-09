import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { validateShortcutToken } from '../services/shortcutService';

const SHORTCUT_PREFIX = 'Shortcut ';

export const shortcutAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith(SHORTCUT_PREFIX)) {
    return next(ApiError.unauthorized('Missing shortcut token'));
  }

  const token = authHeader.slice(SHORTCUT_PREFIX.length).trim();

  try {
    req.userId = await validateShortcutToken(token);

    return next();
  } catch {
    return next(ApiError.unauthorized('Invalid shortcut token'));
  }
};
