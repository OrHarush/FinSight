import * as categoryRepository from '../repositories/categoryRepository';
import { ICategory } from '../models/Category';

export const getCategories = async (userId: string) => {
  return categoryRepository.findAll(userId);
};

export const getCategoryById = async (id: string, userId: string) => {
  return categoryRepository.findById(id, userId);
};

export const createCategory = async (data: Partial<ICategory>, userId: string) => {
  return categoryRepository.create(data, userId);
};

export const updateCategory = async (id: string, data: Partial<ICategory>, userId: string) => {
  return categoryRepository.update(id, data, userId);
};

export const deleteCategory = async (id: string, userId: string) => {
  return categoryRepository.remove(id, userId);
};
