import { ClientSession, Types } from 'mongoose';

import Account, { IAccount } from '../models/Account';

export const findMany = async (workspaceId: string) =>
  Account.find({ workspaceId: new Types.ObjectId(workspaceId) })
    .lean<IAccount[]>()
    .exec();

export const findById = async (id: string, workspaceId: string) =>
  Account.findOne({ _id: id, workspaceId: new Types.ObjectId(workspaceId) })
    .lean<IAccount>()
    .exec();

export const findPrimary = async (workspaceId: string) =>
  Account.findOne({ workspaceId: new Types.ObjectId(workspaceId), isPrimary: true })
    .lean<IAccount>()
    .exec();

export const insert = async (data: Omit<IAccount, '_id'>) => {
  const account = new Account(data);
  return account.save();
};

export const updateById = async (id: string, data: Partial<IAccount>, workspaceId: string) =>
  Account.findOneAndUpdate(
    { _id: id, workspaceId: new Types.ObjectId(workspaceId) },
    data,
    { new: true, runValidators: true }
  )
    .lean<IAccount>()
    .exec();

export const findAnother = async (workspaceId: string, excludeId?: string) => {
  const query: Record<string, unknown> = { workspaceId: new Types.ObjectId(workspaceId) };

  if (excludeId) {
    query._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return Account.findOne(query).lean<IAccount>().exec();
};

export const countByWorkspace = async (workspaceId: string) =>
  Account.countDocuments({ workspaceId: new Types.ObjectId(workspaceId) });

export const remove = async (id: string, workspaceId: string) =>
  Account.findOneAndDelete({ _id: id, workspaceId: new Types.ObjectId(workspaceId) })
    .lean<IAccount>()
    .exec();

export const unsetPrimary = async (workspaceId: string, excludeId?: string) => {
  const query: Record<string, unknown> = { workspaceId: new Types.ObjectId(workspaceId) };

  if (excludeId) {
    query._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return Account.updateMany(query, { $set: { isPrimary: false } });
};

export const deleteMany = (filter: object, session?: ClientSession) =>
  Account.deleteMany(filter).session(session ?? null);
