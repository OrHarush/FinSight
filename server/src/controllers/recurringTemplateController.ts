import {
  CreateRecurringTemplateDTO,
  DeactivateFromDTO,
  SplitRecurringTemplateDTO,
  UpdateRecurringTemplateDTO,
} from '@lyra/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as recurringTemplateService from '../services/recurringTemplateService';

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const templates = await recurringTemplateService.getByUser(req.userId);

  return ApiResponse.ok(res, templates);
});

export const getTemplateById = asyncHandler(async (req: Request, res: Response) => {
  const template = await recurringTemplateService.getById(req.params.id as string, req.userId);

  return ApiResponse.ok(res, template);
});

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await recurringTemplateService.create(
    req.validatedBody as CreateRecurringTemplateDTO,
    req.userId
  );

  return ApiResponse.created(res, template);
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await recurringTemplateService.update(
    req.params.id as string,
    req.validatedBody as UpdateRecurringTemplateDTO,
    req.userId
  );

  return ApiResponse.ok(res, template);
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  await recurringTemplateService.deleteTemplate(req.params.id as string, req.userId);

  return ApiResponse.deleted(res, 'Recurring template deleted successfully');
});

export const createTemplateWithTransactions = asyncHandler(async (req: Request, res: Response) => {
  const result = await recurringTemplateService.createWithTransactions(
    req.validatedBody as CreateRecurringTemplateDTO,
    req.userId
  );

  return ApiResponse.created(res, result);
});

export const deactivateFrom = asyncHandler(async (req: Request, res: Response) => {
  const result = await recurringTemplateService.deactivateFrom(
    req.params.id as string,
    req.validatedBody as DeactivateFromDTO,
    req.userId
  );

  return ApiResponse.ok(res, result);
});

export const splitTemplate = asyncHandler(async (req: Request, res: Response) => {
  const result = await recurringTemplateService.splitTemplate(
    req.params.id as string,
    req.validatedBody as SplitRecurringTemplateDTO,
    req.userId
  );

  return ApiResponse.ok(res, result);
});
