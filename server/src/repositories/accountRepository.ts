import Account, { IAccount } from '../models/Account';
import { Types } from 'mongoose';
import { CreateAccountCommand, UpdateAccountCommand } from '@shared/types/AccountCommands';

export const findMany = async (userId: string) =>
  Account.find({ userId: new Types.ObjectId(userId) });

export const findById = async (id: string, userId: string) =>
  Account.findById({ _id: id, userId: new Types.ObjectId(userId) });

export const insert = async (accountDetails: CreateAccountCommand, userId: string) => {
  const account = new Account({ ...accountDetails, userId: new Types.ObjectId(userId) });

  return account.save();
};

export const updateById = async (
  id: string,
  updatedAccountDetails: UpdateAccountCommand,
  userId: string
) =>
  Account.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, updatedAccountDetails, {
    new: true,
    runValidators: true,
  });

export const findAnother = async (userId: string) =>
  Account.findOne({ userId: new Types.ObjectId(userId) })
    .lean<IAccount>()
    .exec();

export const countByUser = async (userId: string) =>
  Account.countDocuments({ userId: new Types.ObjectId(userId) });

export const remove = async (id: string, userId: string) =>
  Account.findByIdAndDelete({ _id: id, userId: new Types.ObjectId(userId) });

export const unsetPrimary = async (userId: string, excludeId?: string) => {
  const query: any = { userId: new Types.ObjectId(userId) };
  if (excludeId) {
    query._id = { $ne: new Types.ObjectId(excludeId) };
  }
  return Account.updateMany(query, { $set: { isPrimary: false } });
};

export const deleteMany = (filter: object) => Account.deleteMany(filter);
