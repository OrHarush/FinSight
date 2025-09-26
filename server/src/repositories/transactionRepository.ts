import Transaction, { ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';

export const findAll = async (userId: string) => {
  return Transaction.find({ userId: new Types.ObjectId(userId) })
    .sort({ date: -1 })
    .populate('category')
    .populate('account');
};

export const findById = async (id: string, userId: string) => {
  return Transaction.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('category')
    .populate('account');
};

export const create = async (data: Partial<ITransaction>, userId: string) => {
  const transaction = new Transaction({
    ...data,
    userId: new Types.ObjectId(userId),
  });

  return transaction.save();
};

export const update = async (id: string, data: Partial<ITransaction>, userId: string) => {
  return Transaction.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  })
    .populate('category')
    .populate('account');
};

export const remove = async (id: string, userId: string) => {
  return Transaction.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
    .populate('category')
    .populate('account');
};
