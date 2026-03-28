import { Types } from 'mongoose';

import UserActivityEvent from '../models/UserActivityEvent';

export const countDistinctUsersSince = async (since: Date): Promise<number> => {
  const result = await UserActivityEvent.aggregate([
    {
      $match: {
        type: 'LOGIN',
        occurredAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: '$userId',
      },
    },
    {
      $count: 'count',
    },
  ]);

  return result[0]?.count ?? 0;
};


export const findDistinctActiveUserIdsSince = async (since: Date): Promise<Types.ObjectId[]> =>
  UserActivityEvent.distinct('userId', {
    type: 'LOGIN',
    occurredAt: { $gte: since },
  });

export const findLoginEventsWithPictureSince = async (since: Date) =>
  UserActivityEvent.aggregate<{
    userId: Types.ObjectId;
    userName: string;
    occurredAt: Date;
    picture?: string;
  }>([
    { $match: { type: 'LOGIN', occurredAt: { $gte: since } } },
    { $sort: { occurredAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userInfo',
        pipeline: [{ $project: { picture: 1 } }],
      },
    },
    {
      $project: {
        userId: 1,
        userName: 1,
        occurredAt: 1,
        picture: { $arrayElemAt: ['$userInfo.picture', 0] },
      },
    },
  ]);

export const createLoginEvent = async (userId: string, userName: string) => {
  const event = new UserActivityEvent({
    userId: new Types.ObjectId(userId),
    userName,
    type: 'LOGIN',
    occurredAt: new Date(),
  });

  return event.save();
};
