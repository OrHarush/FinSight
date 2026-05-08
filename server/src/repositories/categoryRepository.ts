import { ClientSession, Types } from 'mongoose';

import Category, { ICategory } from '../models/Category';
import Transaction from '../models/Transaction';

export const findMany = async (userId: string) =>
  Category.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean<ICategory[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  Category.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const insert = async (data: Omit<ICategory, '_id'>, session?: ClientSession) => {
  const category = new Category(data);

  return category.save({ session });
};

export const insertMany = (categories: Omit<ICategory, '_id'>[]) =>
  Category.insertMany(categories);

export const updateById = async (id: string, data: Partial<ICategory>, userId: string) =>
  Category.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  });

export const remove = async (id: string, userId: string, session?: ClientSession) =>
  Category.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }).session(session ?? null);

export const deleteMany = (filter: object, session?: ClientSession) =>
  Category.deleteMany(filter).session(session ?? null);

export const findUsageCountsSince = async (
  userId: string,
  sinceDate: Date
): Promise<Map<string, number>> => {
  const rows = await Transaction.aggregate<{ _id: Types.ObjectId; count: number }>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        date: { $gte: sinceDate },
        category: { $exists: true, $ne: null },
      },
    },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  return new Map(rows.map(r => [r._id.toString(), r.count]));
};
