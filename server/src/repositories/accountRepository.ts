import { Types } from 'mongoose';

import Account, { IAccount } from '../models/Account';

export const findMany = async (userId: string) =>
  Account.find({ userId: new Types.ObjectId(userId) })
    .lean<IAccount[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  Account.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IAccount>()
    .exec();

export const insert = async (data: Omit<IAccount, '_id'>) => {
  const account = new Account(data);
  return account.save();
};

export const updateById = async (id: string, data: Partial<IAccount>, userId: string) =>
  Account.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .lean<IAccount>()
    .exec();

export const findAnother = async (userId: string, excludeId?: string) => {
  const query: Record<string, unknown> = { userId: new Types.ObjectId(userId) };

  if (excludeId) {
    query._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return Account.findOne(query).lean<IAccount>().exec();
};

export const countByUser = async (userId: string) =>
  Account.countDocuments({ userId: new Types.ObjectId(userId) });

export const remove = async (id: string, userId: string) =>
  Account.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IAccount>()
    .exec();

export const unsetPrimary = async (userId: string, excludeId?: string) => {
  const query: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
  if (excludeId) {
    query._id = { $ne: new Types.ObjectId(excludeId) };
  }
  return Account.updateMany(query, { $set: { isPrimary: false } });
};

export const deleteMany = (filter: object) => Account.deleteMany(filter);
