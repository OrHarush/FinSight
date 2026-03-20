import { CreateCategoryDTO, UpdateCategoryDTO } from '@finsight/shared';

import { ApiError } from '../errors/ApiError';
import * as categoryRepository from '../repositories/categoryRepository';

export const findAll = async (userId: string) => categoryRepository.findMany(userId);

export const getCategoryById = async (id: string, userId: string) => {
  const category = await categoryRepository.findById(id, userId);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return category;
};

export const create = async (categoryDetails: CreateCategoryDTO, userId: string) =>
  categoryRepository.create(categoryDetails, userId);

export const update = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryDTO,
  userId: string
) => {
  const updated = await categoryRepository.updateById(id, updatedCategoryDetails, userId);

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
