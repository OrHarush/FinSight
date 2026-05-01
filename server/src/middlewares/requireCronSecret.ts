import { timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.warn(
    '[requireCronSecret] CRON_SECRET is not set — /api/cron/* will reject all requests'
  );
}

export const requireCronSecret = (req: Request, res: Response, next: NextFunction) => {
  if (!CRON_SECRET) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const headerValue = req.headers['x-cron-secret'];

  if (typeof headerValue !== 'string') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const provided = Buffer.from(headerValue);
  const expected = Buffer.from(CRON_SECRET);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  next();
};
