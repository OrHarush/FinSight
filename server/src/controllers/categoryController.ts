import { Response } from 'express';
import * as categoryService from '../services/categoryService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized();
  }

  const categories = await categoryService.findAll(req.userId);

  return ApiResponse.ok(res, categories);
});

export const getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized();
  }

  const category = await categoryService.getCategoryById(req.params.id, req.userId);

  return ApiResponse.ok(res, category);
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized();
  }

  const category = await categoryService.create(req.body, req.userId);

  return ApiResponse.created(res, category);
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized();
  }

  const updated = await categoryService.update(req.params.id, req.body, req.userId);

  if (!updated) {
    throw ApiError.notFound('Category not found');
  }

  return ApiResponse.ok(res, updated);
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw ApiError.unauthorized();
  }

  const deleted = await categoryService.deleteCategory(req.params.id, req.userId);

  if (!deleted) {
    throw ApiError.notFound('Category not found');
  }

  return ApiResponse.deleted(res, 'Category deleted successfully');
});
