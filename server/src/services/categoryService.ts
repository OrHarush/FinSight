import { CreateCategoryDTO, UpdateCategoryDTO } from '@finsight/shared';
import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { ICategory } from '../models/Category';
import * as categoryRepository from '../repositories/categoryRepository';

export const findAll = async (userId: string) => categoryRepository.findMany(userId);

export const getCategoryById = async (id: string, userId: string) => {
  const category = await categoryRepository.findById(id, userId);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return category;
};

export const create = async (categoryDetails: CreateCategoryDTO, userId: string) => {
  const mapped: Omit<ICategory, '_id'> = {
    key: categoryDetails.key,
    name: categoryDetails.name,
    type: categoryDetails.type,
    color: categoryDetails.color ?? '#9ca3af',
    icon: categoryDetails.icon ?? '',
    userId: new Types.ObjectId(userId),
  };

  return categoryRepository.insert(mapped);
};

export const update = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryDTO,
  userId: string
) => {
  const mapped: Partial<ICategory> = {};

  if (updatedCategoryDetails.name !== undefined) mapped.name = updatedCategoryDetails.name;
  if (updatedCategoryDetails.type !== undefined) mapped.type = updatedCategoryDetails.type;
  if (updatedCategoryDetails.color !== undefined) mapped.color = updatedCategoryDetails.color;
  if (updatedCategoryDetails.icon !== undefined) mapped.icon = updatedCategoryDetails.icon;

  const updated = await categoryRepository.updateById(id, mapped, userId);

  if (!updated) {
    throw ApiError.notFound('Category not found');
  }

  return updated;
};

export const deleteCategory = async (id: string, userId: string) => {
  const deleted = await categoryRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.notFound('Category not found');
  }

  return deleted;
};
