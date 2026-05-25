import User from '../models/User';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface UserRetentionRow {
  signupAt: Date;
  firstReturnActivityAt: Date | null;
  d1: boolean;
  d7: boolean;
  activated: boolean;
  ageInDays: number;
}

export const aggregateUserRetention = async (
  now: Date = new Date()
): Promise<UserRetentionRow[]> =>
  User.aggregate<UserRetentionRow>([
    {
      $lookup: {
        from: 'transactions',
        let: { uid: '$_id', signupAt: '$createdAt' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$uid'] },
                  { $gt: ['$createdAt', '$$signupAt'] },
                ],
              },
            },
          },
          { $sort: { createdAt: 1 } },
          { $limit: 1 },
          { $project: { _id: 0, createdAt: 1 } },
        ],
        as: 'firstReturn',
      },
    },
    {
      $addFields: {
        signupAt: '$createdAt',
        firstReturnActivityAt: {
          $ifNull: [{ $arrayElemAt: ['$firstReturn.createdAt', 0] }, null],
        },
      },
    },
    {
      $project: {
        _id: 0,
        signupAt: 1,
        firstReturnActivityAt: 1,
        d1: {
          $cond: {
            if: { $eq: ['$firstReturnActivityAt', null] },
            then: false,
            else: { $lte: ['$firstReturnActivityAt', { $add: ['$signupAt', DAY_MS] }] },
          },
        },
        d7: {
          $cond: {
            if: { $eq: ['$firstReturnActivityAt', null] },
            then: false,
            else: { $lte: ['$firstReturnActivityAt', { $add: ['$signupAt', 7 * DAY_MS] }] },
          },
        },
        activated: { $ne: [{ $ifNull: ['$activatedAt', null] }, null] },
        ageInDays: {
          $floor: { $divide: [{ $subtract: [now, '$signupAt'] }, DAY_MS] },
        },
      },
    },
  ]);
