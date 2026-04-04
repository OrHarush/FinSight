import { CreateCategoryDTO, UpdateCategoryDTO } from '@finsight/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as categoryService from '../services/categoryService';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.findAll(req.userId);

  return ApiResponse.ok(res, categories);
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id as string, req.userId);

  return ApiResponse.ok(res, category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.create(req.validatedBody as CreateCategoryDTO, req.userId);

  return ApiResponse.created(res, category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updated = await categoryService.update(
    req.params.id as string,
    req.validatedBody as UpdateCategoryDTO,
    req.userId
  );

  return ApiResponse.ok(res, updated);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id as string, req.userId);

  return ApiResponse.deleted(res, 'Category deleted successfully');
});
