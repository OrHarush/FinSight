import * as categoryRepository from '../repositories/categoryRepository';
import { ICategory } from '../models/Category';

export const getCategories = async () => {
  return categoryRepository.findAll();
};

export const getCategoryById = async (id: string) => {
  return categoryRepository.findById(id);
};

export const createCategory = async (data: Partial<ICategory>) => {
  return categoryRepository.create(data);
};

export const updateCategory = async (id: string, data: Partial<ICategory>) => {
  return categoryRepository.update(id, data);
};

export const deleteCategory = async (id: string) => {
  return categoryRepository.remove(id);
};
