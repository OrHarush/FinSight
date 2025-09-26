import Category, { ICategory } from '../models/Category';
import { Types } from 'mongoose';

export const findAll = async (userId: string) => {
  return Category.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
};

export const findById = async (id: string, userId: string) => {
  return Category.findOne({ _id: id, userId: new Types.ObjectId(userId) });
};

export const create = async (data: Partial<ICategory>, userId: string) => {
  const category = new Category({ ...data, userId: new Types.ObjectId(userId) });

  return category.save();
};

export const update = async (id: string, data: Partial<ICategory>, userId: string) => {
  return Category.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  });
};

export const remove = async (id: string, userId: string) => {
  return Category.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
};
