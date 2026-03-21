import { Types } from 'mongoose';

import Category, { ICategory } from '../models/Category';

export const findMany = async (userId: string) =>
  Category.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean<ICategory[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  Category.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const insert = async (data: Omit<ICategory, '_id'>) => {
  const category = new Category(data);

  return category.save();
};

export const insertMany = (categories: Omit<ICategory, '_id'>[]) =>
  Category.insertMany(categories);

export const updateById = async (id: string, data: Partial<ICategory>, userId: string) =>
  Category.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, {
    new: true,
    runValidators: true,
  });

export const remove = async (id: string, userId: string) =>
  Category.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });

export const deleteMany = (filter: object) => Category.deleteMany(filter);
