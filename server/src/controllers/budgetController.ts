import {
  CreateBudgetBulkDTO,
  CreateBudgetDTO,
  GetBudgetsQuery,
  UpdateBudgetDTO,
} from '@finsight/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as budgetService from '../services/budgetService';

export const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await budgetService.findAll(req.userId, req.validatedQuery as GetBudgetsQuery);

  return ApiResponse.ok(res, budgets);
});

export const getBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.getBudgetById(req.params.id as string, req.userId);

  return ApiResponse.ok(res, budget);
});

export const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const budget = await budgetService.create(req.validatedBody as CreateBudgetDTO, req.userId);

  return ApiResponse.created(res, budget);
});

export const createBudgetBulk = asyncHandler(async (req: Request, res: Response) => {
  const budgets = await budgetService.createBulk(
    req.validatedBody as CreateBudgetBulkDTO,
    req.userId
  );

  return ApiResponse.created(res, budgets);
});

export const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const updatedBudget = await budgetService.update(
    req.params.id as string,
    req.validatedBody as UpdateBudgetDTO,
    req.userId
  );

  return ApiResponse.ok(res, updatedBudget);
});

export const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  await budgetService.deleteBudget(req.params.id as string, req.userId);

  return ApiResponse.deleted(res, 'Budgets deleted successfully');
});
