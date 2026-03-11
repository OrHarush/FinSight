import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  GetBudgetsQuery,
  CreateBudgetBody,
  CreateBudgetBulkBody,
  UpdateBudgetBody,
} from '../schemas/budgetSchemas';

export const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await budgetService.findAll(req.userId, req.validatedQuery as GetBudgetsQuery);

  return ApiResponse.ok(res, budgets);
});

export const getBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.getBudgetById(req.params.id, req.userId);

  return ApiResponse.ok(res, budget);
});

export const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.create(req.validatedBody as CreateBudgetBody, req.userId);

  return ApiResponse.created(res, budget);
});

export const createBudgetBulk = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await budgetService.createBulk(
    req.validatedBody as CreateBudgetBulkBody,
    req.userId
  );

  return ApiResponse.created(res, budgets);
});

export const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const updatedBudget = await budgetService.update(
    req.params.id,
    req.validatedBody as UpdateBudgetBody,
    req.userId
  );

  return ApiResponse.ok(res, updatedBudget);
});

export const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  await budgetService.deleteBudget(req.params.id, req.userId);

  return ApiResponse.deleted(res, 'Budgets deleted successfully');
});
