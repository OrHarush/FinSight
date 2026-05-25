import { Types } from 'mongoose';

import DailyActivity from '../models/DailyActivity';

export const upsertDailyActivity = async (userId: string, date: string): Promise<void> => {
  const uid = new Types.ObjectId(userId);

  await DailyActivity.updateOne({ userId: uid, date }, { $setOnInsert: { userId: uid, date } }, { upsert: true });
};
