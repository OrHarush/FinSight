import Account, { IAccount } from '../models/Account';
import { Types } from 'mongoose';

export const findAll = async (userId: string) => {
  return Account.find({ userId: new Types.ObjectId(userId) });
};

export const findById = async (id: string, userId: string) => {
  return Account.findById({ _id: id, userId: new Types.ObjectId(userId) });
};

export const create = async (data: Partial<IAccount>, userId: string) => {
  const account = new Account({ ...data, userId: new Types.ObjectId(userId) });

  return account.save();
};

export const update = async (id: string, data: Partial<IAccount>, userId: string) => {
  return Account.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  });
};

export const remove = async (id: string, userId: string) => {
  return Account.findByIdAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
};
