import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const { year, month, categoryId } = req.query;

  const options: any = {};

  if (year !== undefined) {
    options.year = parseInt(year as string, 10);
  }

  if (month !== undefined) {
    options.month = parseInt(month as string, 10);
  }

  if (categoryId !== undefined) {
    options.categoryId = categoryId as string;
  }

  const budgets = await budgetService.findAll(req.userId, options);

  return ApiResponse.ok(res, budgets);
});

export const getBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.getBudgetById(req.params.id, req.userId);

  return ApiResponse.ok(res, budget);
});

export const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.create(req.body, req.userId);

  return ApiResponse.created(res, budget);
});

export const createBudgetBulk = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await budgetService.createBulk(req.body, req.userId);

  return ApiResponse.created(res, budgets);
});

export const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const updatedBudget = await budgetService.update(req.params.id, req.body, req.userId);

  return ApiResponse.ok(res, updatedBudget);
});

export const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  await budgetService.deleteBudget(req.params.id, req.userId);

  return ApiResponse.deleted(res, 'Budgets deleted successfully');
});
