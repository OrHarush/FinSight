import { NextFunction, Request, Response } from 'express';

import { resolveWorkspaceForRequest } from '../services/workspaceService';

export const workspaceContextMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = await resolveWorkspaceForRequest(req.userId);
    req.workspaceId = workspaceId.toString();

    return next();
  } catch (err) {
    return next(err);
  }
};
