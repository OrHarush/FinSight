import { Request, Response } from 'express';

import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import { CheckDuplicatesDTO, ImportTransactionsDTO } from '../schemas/importSchemas';
import * as importService from '../services/importService';

export const getImportPreview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest(
      'No file uploaded. Send a multipart/form-data request with a "file" field.'
    );
  }

  const preview = await importService.getImportPreview(req.file);

  return ApiResponse.ok(res, preview);
});

export const importTransactions = asyncHandler(async (req: Request, res: Response) => {
  const result = await importService.importTransactions(
    req.validatedBody as ImportTransactionsDTO,
    req.userId
  );

  return ApiResponse.created(res, result);
});

export const checkDuplicates = asyncHandler(async (req: Request, res: Response) => {
  const result = await importService.findDuplicates(
    req.validatedBody as CheckDuplicatesDTO,
    req.userId
  );

  return ApiResponse.ok(res, result);
});
