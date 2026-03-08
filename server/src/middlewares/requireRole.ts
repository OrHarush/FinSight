import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/types/Role';

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole as UserRole | undefined;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
