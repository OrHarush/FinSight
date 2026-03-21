import {
  CreateBudgetBulkDTO,
  CreateBudgetDTO,
  GetBudgetsQuery,
  UpdateBudgetDTO,
} from '@finsight/shared';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { IBudget } from '../models/Budget';
import * as budgetRepository from '../repositories/budgetRepository';

export const findAll = async (userId: string, options: GetBudgetsQuery) =>
  budgetRepository.findMany(userId, options);

export const getBudgetById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid budget ID');
  }

  const budget = await budgetRepository.findById(id, userId);

  if (!budget) {
    throw ApiError.notFound('Budgets not found');
  }

  return budget;
};

export const create = async (data: CreateBudgetDTO, userId: string) => {
  // month from client is 1-based (1-12); DB stores 0-based (0-11)
  const dbMonth = data.month - 1;

  const existing = await budgetRepository.findByMonthYearCategory(
    userId,
    data.categoryId,
    data.year,
    dbMonth
  );

  if (existing) {
    throw ApiError.badRequest(
      `Budget already exists for ${data.year}-${String(data.month).padStart(2, '0')}`
    );
  }

  const mapped: Omit<IBudget, '_id'> = {
    userId: new Types.ObjectId(userId),
    categoryId: new Types.ObjectId(data.categoryId),
    year: data.year,
    month: dbMonth,
    limit: data.limit,
  };

  return budgetRepository.insert(mapped);
};

export const createBulk = async (data: CreateBudgetBulkDTO, userId: string) => {
  const budgets: Omit<IBudget, '_id'>[] = [];

  // startMonth/endMonth are 1-based; convert to 0-based for DB
  for (let month1based = data.startMonth; month1based <= data.endMonth; month1based++) {
    const dbMonth = month1based - 1;

    const existing = await budgetRepository.findByMonthYearCategory(
      userId,
      data.categoryId,
      data.year,
      dbMonth
    );

    if (!existing) {
      budgets.push({
        userId: new Types.ObjectId(userId),
        categoryId: new Types.ObjectId(data.categoryId),
        year: data.year,
        month: dbMonth,
        limit: data.limit,
      });
    }
  }

  if (budgets.length === 0) {
    throw ApiError.badRequest('No new budgets to create - all already exist');
  }

  return budgetRepository.insertMany(budgets);
};

export const update = async (id: string, data: UpdateBudgetDTO, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid budget ID');
  }

  const existing = await budgetRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Budgets not found');
  }

  const mapped: Partial<IBudget> = {};

  if (data.limit !== undefined) mapped.limit = data.limit;

  const updated = await budgetRepository.updateById(id, mapped, userId);

  if (!updated) {
    throw ApiError.internal('Unexpected error updating budget');
  }

  return updated;
};

export const deleteBudget = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid budget ID');
  }

  const existing = await budgetRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Budgets not found');
  }

  const deleted = await budgetRepository.remove(id, userId);

  if (!deleted) {
    throw ApiError.internal('Unexpected error deleting budget');
  }

  return deleted;
};
