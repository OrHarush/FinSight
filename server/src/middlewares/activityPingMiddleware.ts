import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { NextFunction, Request, Response } from 'express';

import * as dailyActivityRepository from '../repositories/dailyActivityRepository';

dayjs.extend(utc);
dayjs.extend(timezone);

const ISRAEL_TZ = 'Asia/Jerusalem';

let today = dayjs().tz(ISRAEL_TZ).format('YYYY-MM-DD');
let pingedUsers = new Set<string>();

export const activityPingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const nowDate = dayjs().tz(ISRAEL_TZ).format('YYYY-MM-DD');

  if (nowDate !== today) {
    today = nowDate;
    pingedUsers = new Set<string>();
  }

  const { userId } = req;

  if (userId && !pingedUsers.has(userId)) {
    pingedUsers.add(userId);
    void dailyActivityRepository.upsertDailyActivity(userId, nowDate).catch(err => {
      console.error('[activityPing] upsert failed', err);
    });
  }

  return next();
};
