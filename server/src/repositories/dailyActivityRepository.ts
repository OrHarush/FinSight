import { Types } from 'mongoose';

import DailyActivity from '../models/DailyActivity';

export const countByUser = async (userId: string): Promise<number> =>
  DailyActivity.countDocuments({ userId: new Types.ObjectId(userId) });

export const upsertDailyActivity = async (userId: string, date: string): Promise<void> => {
  const uid = new Types.ObjectId(userId);

  await DailyActivity.updateOne({ userId: uid, date }, { $setOnInsert: { userId: uid, date } }, { upsert: true });
};
