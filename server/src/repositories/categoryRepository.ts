import Category from '../models/Category';
import { Types } from 'mongoose';
import { CreateCategoryCommand, UpdateCategoryCommand } from '@shared/types/CategoryCommands';

export const findAll = async (userId: string) =>
  Category.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });

export const findById = async (id: string, userId: string) =>
  Category.findOne({ _id: id, userId: new Types.ObjectId(userId) });

export const create = async (categoryDetails: CreateCategoryCommand, userId: string) => {
  const category = new Category({ ...categoryDetails, userId: new Types.ObjectId(userId) });

  return category.save();
};

export const update = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryCommand,
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
