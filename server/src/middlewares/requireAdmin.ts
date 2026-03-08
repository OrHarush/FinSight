import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).userRole;

  if (userRole !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
  }

  next();
};
