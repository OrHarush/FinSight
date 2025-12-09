import { Response, Request } from 'express';
import * as categoryService from '../services/categoryService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.findAll(req.userId);

  return ApiResponse.ok(res, categories);
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id, req.userId);

  return ApiResponse.ok(res, category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body, req.userId);

  return ApiResponse.created(res, category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updated = await categoryService.update(req.params.id, req.body, req.userId);

  return ApiResponse.ok(res, updated);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id, req.userId);

  return ApiResponse.deleted(res, 'Category deleted successfully');
});
