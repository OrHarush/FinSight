import * as categoryRepository from '../repositories/categoryRepository';
import { ICategory } from '../models/Category';

export const createCategory = async (data: ICategory) => {
  if (!data.name) {
    throw new Error('Category name is required');
  }

  return categoryRepository.create(data);
};

export const getCategories = async () => {
  return categoryRepository.findAll();
};

export const getCategoryById = async (id: string) => {
  return categoryRepository.findById(id);
};

export const updateCategory = async (id: string, data: Partial<ICategory>) => {
  return categoryRepository.update(id, data);
};

export const deleteCategory = async (id: string) => {
  return categoryRepository.remove(id);
};
