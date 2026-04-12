import { Types } from 'mongoose';

import AnalyticsEvent, { AnalyticsEventType } from '../models/AnalyticsEvent';

export const insertEvent = async (userId: string, event: AnalyticsEventType) => {
  const doc = new AnalyticsEvent({
    userId: new Types.ObjectId(userId),
    event,
  });

  return doc.save();
};

export const countByEvent = async (event: AnalyticsEventType, since?: Date): Promise<number> => {
  const filter: Record<string, unknown> = { event };

  if (since) {
    filter.createdAt = { $gte: since };
  }

  return AnalyticsEvent.countDocuments(filter);
};

export interface RecentActivityRow {
  userId: string;
  userName: string;
  userAvatar: string;
  event: AnalyticsEventType;
  createdAt: Date;
}

export const findRecentWithUser = async (limit: number): Promise<RecentActivityRow[]> => {
  const rows = await AnalyticsEvent.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: { $toString: '$userId' },
        userName: '$user.name',
        userAvatar: { $ifNull: ['$user.picture', ''] },
        event: 1,
        createdAt: 1,
      },
    },
  ]);

  return rows;
};
