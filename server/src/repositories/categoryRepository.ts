import { CreateCategoryDTO, UpdateCategoryDTO } from '@finsight/shared';
import { Types } from 'mongoose';

import Category, { ICategory } from '../models/Category';

export const findMany = async (userId: string) =>
  Category.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean<ICategory[]>()
    .exec();

export const findById = async (id: string, userId: string) =>
  Category.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const create = async (categoryDetails: CreateCategoryDTO, userId: string) => {
  const category = new Category({ ...categoryDetails, userId: new Types.ObjectId(userId) });

  return category.save();
};

export const createMany = (categories: CreateCategoryDTO[]) => Category.insertMany(categories);

export const updateById = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryDTO,
  userId: string
) =>
  Category.findOneAndUpdate(
    { _id: id, userId: new Types.ObjectId(userId) },
    updatedCategoryDetails,
    {
      new: true,
      runValidators: true,
    }
  );

export const remove = async (id: string, userId: string) =>
  Category.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });

export const deleteMany = (filter: object) => Category.deleteMany(filter);
