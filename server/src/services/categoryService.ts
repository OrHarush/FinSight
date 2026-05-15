import { CreateCategoryDTO, UpdateCategoryDTO } from '@lyra/shared';
import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { ICategory } from '../models/Category';
import * as categoryRepository from '../repositories/categoryRepository';
import * as goalRepository from '../repositories/goalRepository';
import * as analyticsService from './analyticsService';

const FREQUENT_WINDOW_DAYS = 60;
const FREQUENT_MIN_USES = 3;
const FREQUENT_MAX = 3;

export const findAll = async (userId: string) => {
  const sinceDate = new Date(Date.now() - FREQUENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [categories, usageCounts] = await Promise.all([
    categoryRepository.findMany(userId),
    categoryRepository.findUsageCountsSince(userId, sinceDate),
  ]);

  const withCounts = categories.map(c => ({
    ...c,
    usageCount: usageCounts.get(c._id.toString()) ?? 0,
  }));

  const frequentIds = new Set(
    withCounts
      .filter(c => c.usageCount >= FREQUENT_MIN_USES)
      .sort((a, b) => b.usageCount - a.usageCount || a.name.localeCompare(b.name))
      .slice(0, FREQUENT_MAX)
      .map(c => c._id.toString())
  );

  return withCounts
    .map(c => ({ ...c, isFrequent: frequentIds.has(c._id.toString()) }))
    .sort((a, b) => {
      if (a.isFrequent !== b.isFrequent) {
        return a.isFrequent ? -1 : 1;
      }

      if (a.isFrequent && b.isFrequent) {
        return b.usageCount - a.usageCount || a.name.localeCompare(b.name);
      }

      return a.name.localeCompare(b.name);
    });
};

export const getCategoryById = async (id: string, userId: string) => {
  const category = await categoryRepository.findById(id, userId);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  return category;
};

export const create = async (categoryDetails: CreateCategoryDTO, userId: string) => {
  if (categoryDetails.type === 'Savings') {
    throw ApiError.badRequest('SAVINGS_CATEGORY_REQUIRES_GOAL');
  }

  const mapped: Omit<ICategory, '_id'> = {
    key: categoryDetails.key,
    name: categoryDetails.name,
    type: categoryDetails.type,
    color: categoryDetails.color ?? '#9ca3af',
    icon: categoryDetails.icon ?? '',
    userId: new Types.ObjectId(userId),
  };

  const created = await categoryRepository.insert(mapped);

  void analyticsService
    .track(userId, 'category_created')
    .catch(err => console.error('Failed to track category_created:', err));

  return created;
};

export const update = async (
  id: string,
  updatedCategoryDetails: UpdateCategoryDTO,
  userId: string
) => {
  if (updatedCategoryDetails.type === 'Savings') {
    throw ApiError.badRequest('SAVINGS_CATEGORY_REQUIRES_GOAL');
  }

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
  const linkedGoal = await goalRepository.findByCategoryId(id);

  if (linkedGoal && linkedGoal.userId.toString() === userId) {
    throw ApiError.badRequest(
      `CATEGORY_LINKED_TO_GOAL:${linkedGoal._id.toString()}:${linkedGoal.name}`
    );
  }

  const deleted = await categoryRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.notFound('Category not found');
  }

  return deleted;
};
