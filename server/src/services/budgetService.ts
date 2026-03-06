import * as budgetRepository from '../repositories/budgetRepository';
import {
  CreateBudgetCommand,
  UpdateBudgetCommand,
  BulkCreateBudgetCommand,
} from '@shared/types/BudgetCommands';
import { ApiError } from '../errors/ApiError';
import mongoose from 'mongoose';

export const findAll = async (
  userId: string,
  options?: { year?: number; month?: number; categoryId?: string }
) => budgetRepository.findMany(userId, options);

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

export const create = async (data: CreateBudgetCommand, userId: string) => {
  validateBudgetCreation(data);

  const existing = await budgetRepository.findByMonthYearCategory(
    userId,
    data.categoryId,
    data.year,
    data.month
  );

  if (existing) {
    throw ApiError.badRequest(
      `Budget already exists for ${data.year}-${String(data.month + 1).padStart(2, '0')}`
    );
  }

  return budgetRepository.insert(data, userId);
};

export const createBulk = async (command: BulkCreateBudgetCommand, userId: string) => {
  validateBulkBudgetCreation(command);

  const budgets: Array<CreateBudgetCommand & { userId: string }> = [];

  for (let month = command.startMonth; month <= command.endMonth; month++) {
    const existing = await budgetRepository.findByMonthYearCategory(
      userId,
      command.categoryId,
      command.year,
      month
    );

    if (!existing) {
      budgets.push({
        categoryId: command.categoryId,
        year: command.year,
        month,
        limit: command.limit,
        userId,
      });
    }
  }

  if (budgets.length === 0) {
    throw ApiError.badRequest('No new budgets to create - all already exist');
  }

  return budgetRepository.insertMany(budgets);
};

export const update = async (id: string, data: UpdateBudgetCommand, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid budget ID');
  }

  const existing = await budgetRepository.findById(id, userId);

  if (!existing) {
    throw ApiError.notFound('Budgets not found');
  }

  if (data.limit !== undefined) {
    if (data.limit < 0) {
      throw ApiError.badRequest('Budgets limit cannot be negative');
    }
  }

  const updated = await budgetRepository.updateById(id, data, userId);

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

const validateBudgetCreation = (data: CreateBudgetCommand) => {
  if (!data.categoryId) {
    throw ApiError.badRequest('Category ID is required');
  }

  if (data.year < 2000 || data.year > 2100) {
    throw ApiError.badRequest('Year must be between 2000 and 2100');
  }

  if (data.month < 0 || data.month > 11) {
    throw ApiError.badRequest('Month must be between 0 (January) and 11 (December)');
  }

  if (data.limit < 0) {
    throw ApiError.badRequest('Budgets limit cannot be negative');
  }

  if (!mongoose.Types.ObjectId.isValid(data.categoryId)) {
    throw ApiError.badRequest('Invalid category ID format');
  }

  // Validate that category belongs to user and is an Expense category
  // SUGGESTION: This should be done async - consider making validateBudgetCreation async
  // and fetching category here, OR do it in controller before calling service
};

const validateBulkBudgetCreation = (command: BulkCreateBudgetCommand) => {
  if (!command.categoryId) {
    throw ApiError.badRequest('Category ID is required');
  }

  if (command.year < 2000 || command.year > 2100) {
    throw ApiError.badRequest('Year must be between 2000 and 2100');
  }

  if (command.limit < 0) {
    throw ApiError.badRequest('Budgets limit cannot be negative');
  }

  if (!mongoose.Types.ObjectId.isValid(command.categoryId)) {
    throw ApiError.badRequest('Invalid category ID format');
  }

  if (command.startMonth < 0 || command.startMonth > 11) {
    throw ApiError.badRequest('Start month must be between 0 and 11');
  }

  if (command.endMonth < 0 || command.endMonth > 11) {
    throw ApiError.badRequest('End month must be between 0 and 11');
  }

  if (command.startMonth > command.endMonth) {
    throw ApiError.badRequest('Start month cannot be after end month');
  }
};
