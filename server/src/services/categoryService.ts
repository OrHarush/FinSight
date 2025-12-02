import * as categoryRepository from '../repositories/categoryRepository';
import { CreateCategoryCommand, UpdateCategoryCommand } from '@shared/types/CategoryCommands';
import { ApiError } from '../errors/ApiError';

export const findAll = async (userId: string) => categoryRepository.findMany(userId);

export const getCategoryById = async (id: string, userId: string) => {
  const category = await categoryRepository.findById(id, userId);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return category;
};

export const create = async (categoryDetails: CreateCategoryCommand, userId: string) =>
  categoryRepository.create(categoryDetails, userId);

export const update = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryCommand,
  userId: string
) => categoryRepository.updateById(id, updatedCategoryDetails, userId);

export const deleteCategory = async (id: string, userId: string) =>
  categoryRepository.remove(id, userId);
