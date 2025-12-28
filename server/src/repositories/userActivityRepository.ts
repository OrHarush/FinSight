import UserActivityEvent from '../models/UserActivityEvent';
import { Types } from 'mongoose';

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

export const avgLoginsPerUserSince = async (since: Date): Promise<number> => {
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
        logins: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        avg: { $avg: '$logins' },
      },
    },
  ]);

  return result[0]?.avg ?? 0;
};

export const findDistinctActiveUserIdsSince = async (since: Date): Promise<Types.ObjectId[]> =>
  UserActivityEvent.distinct('userId', {
    type: 'LOGIN',
    occurredAt: { $gte: since },
  });

export const createLoginEvent = async (userId: string, userName: string) => {
  const event = new UserActivityEvent({
    userId: new Types.ObjectId(userId),
    userName,
    type: 'LOGIN',
    occurredAt: new Date(),
  });

  console.log(event);

  return event.save();
};
