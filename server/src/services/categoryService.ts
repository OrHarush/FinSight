import * as categoryRepository from '../repositories/categoryRepository';
import { ICategory } from '../models/Category';
import { CreateCategoryCommand, UpdateCategoryCommand } from '@shared/types/CategoryCommands';

export const getCategories = async (userId: string) => categoryRepository.findAll(userId);

export const getCategoryById = async (id: string, userId: string) =>
  categoryRepository.findById(id, userId);

export const createCategory = async (categoryDetails: CreateCategoryCommand, userId: string) =>
  categoryRepository.create(categoryDetails, userId);

export const updateCategory = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryCommand,
  userId: string
) => categoryRepository.update(id, updatedCategoryDetails, userId);

export const deleteCategory = async (id: string, userId: string) =>
  categoryRepository.remove(id, userId);
