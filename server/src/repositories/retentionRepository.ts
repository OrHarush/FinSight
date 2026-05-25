import User from '../models/User';

const DAY_MS = 24 * 60 * 60 * 1000;
const ISRAEL_TZ = 'Asia/Jerusalem';

export interface UserRetentionRow {
  signupAt: Date;
  d1: boolean;
  d7: boolean;
  activated: boolean;
  activationDepth: boolean;
  ageInDays: number;
}

export const aggregateUserRetention = async (
  now: Date = new Date()
): Promise<UserRetentionRow[]> =>
  User.aggregate<UserRetentionRow>([
    {
      $lookup: {
        from: 'transactions',
        let: { uid: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
          { $project: { _id: 0, createdAt: 1 } },
        ],
        as: 'userTransactions',
      },
    },
    {
      $lookup: {
        from: 'daily_activities',
        let: { uid: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
          { $project: { _id: 0, date: 1 } },
        ],
        as: 'activityPings',
      },
    },
    {
      $addFields: {
        txCount: { $size: '$userTransactions' },
        txDayOffsets: {
          $map: {
            input: '$userTransactions',
            as: 'tx',
            in: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: '$$tx.createdAt',
                unit: 'day',
                timezone: ISRAEL_TZ,
              },
            },
          },
        },
        pingDayOffsets: {
          $map: {
            input: '$activityPings',
            as: 'ping',
            in: {
              $dateDiff: {
                startDate: '$createdAt',
                endDate: { $dateFromString: { dateString: '$$ping.date', timezone: ISRAEL_TZ } },
                unit: 'day',
                timezone: ISRAEL_TZ,
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        allActivityOffsets: { $concatArrays: ['$txDayOffsets', '$pingDayOffsets'] },
      },
    },
    {
      $project: {
        _id: 0,
        signupAt: '$createdAt',
        d1: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: '$allActivityOffsets',
                  as: 'd',
                  cond: { $gte: ['$$d', 1] },
                },
              },
            },
            0,
          ],
        },
        d7: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: '$allActivityOffsets',
                  as: 'd',
                  cond: {
                    $and: [{ $gte: ['$$d', 1] }, { $lte: ['$$d', 7] }],
                  },
                },
              },
            },
            0,
          ],
        },
        activated: { $ne: [{ $ifNull: ['$activatedAt', null] }, null] },
        activationDepth: { $gte: ['$txCount', 2] },
        ageInDays: {
          $floor: { $divide: [{ $subtract: [now, '$createdAt'] }, DAY_MS] },
        },
      },
    },
  ]);
