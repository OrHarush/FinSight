import { Types } from 'mongoose';

import MerchantRule, { IMerchantRule } from '../models/MerchantRule';

export const findByMatchKey = (
  userId: string,
  matchKey: string
): Promise<IMerchantRule | null> =>
  MerchantRule.findOne({ userId: new Types.ObjectId(userId), matchKey }).lean<IMerchantRule>().exec();

export const upsert = (
  userId: string,
  matchKey: string,
  data: { alias?: string | null; categoryId?: string | null }
) =>
  MerchantRule.findOneAndUpdate(
    { userId: new Types.ObjectId(userId), matchKey },
    {
      $set: {
        alias: data.alias ?? null,
        categoryId: data.categoryId ? new Types.ObjectId(data.categoryId) : null,
      },
    },
    { new: true, upsert: true }
  );
