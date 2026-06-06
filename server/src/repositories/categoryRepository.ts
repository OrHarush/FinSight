import { ClientSession, Types } from 'mongoose';

import Category, { ICategory } from '../models/Category';
import Transaction from '../models/Transaction';

export const findMany = async (workspaceId: string) =>
  Category.find({ workspaceId: new Types.ObjectId(workspaceId) })
    .sort({ createdAt: -1 })
    .lean<ICategory[]>()
    .exec();

export const findById = async (id: string, workspaceId: string) =>
  Category.findOne({ _id: id, workspaceId: new Types.ObjectId(workspaceId) });

export const findByType = async (workspaceId: string, type: ICategory['type']) =>
  Category.find({ workspaceId: new Types.ObjectId(workspaceId), type })
    .sort({ name: 1 })
    .lean<ICategory[]>()
    .exec();

export const findByIdUnscoped = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return Category.findById(id).lean<ICategory>().exec();
};

export const insert = async (data: Omit<ICategory, '_id'>, session?: ClientSession) => {
  const category = new Category(data);

  return category.save({ session });
};

export const insertMany = (
  categories: Omit<ICategory, '_id'>[],
  session?: ClientSession
) => Category.insertMany(categories, { session });

export const updateById = async (id: string, data: Partial<ICategory>, workspaceId: string) =>
  Category.findOneAndUpdate(
    { _id: id, workspaceId: new Types.ObjectId(workspaceId) },
    data,
    { new: true, runValidators: true }
  );

export const remove = async (id: string, workspaceId: string, session?: ClientSession) =>
  Category.findOneAndDelete({ _id: id, workspaceId: new Types.ObjectId(workspaceId) }).session(
    session ?? null
  );

export const deleteMany = (filter: object, session?: ClientSession) =>
  Category.deleteMany(filter).session(session ?? null);

export const findUsageCountsSince = async (
  workspaceId: string,
  sinceDate: Date
): Promise<Map<string, number>> => {
  const rows = await Transaction.aggregate<{ _id: Types.ObjectId; count: number }>([
    {
      $match: {
        workspaceId: new Types.ObjectId(workspaceId),
        date: { $gte: sinceDate },
        category: { $exists: true, $ne: null },
      },
    },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  return new Map(rows.map(r => [r._id.toString(), r.count]));
};
