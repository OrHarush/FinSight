import { CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '@lyra/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as paymentMethodService from '../services/paymentMethodService';

export const getPaymentMethods = asyncHandler(async (req: Request, res: Response) => {
  const methods = await paymentMethodService.findAll(req.workspaceId);

  return ApiResponse.ok(res, methods);
});

export const getPaymentMethodById = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.getById(req.params.id as string, req.workspaceId);

  return ApiResponse.ok(res, method);
});

export const createPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.create(
    req.validatedBody as CreatePaymentMethodDTO,
    req.userId,
    req.workspaceId
  );

  return ApiResponse.created(res, method);
});

export const updatePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const updated = await paymentMethodService.update(
    req.params.id as string,
    req.validatedBody as UpdatePaymentMethodDTO,
    req.workspaceId
  );

  return ApiResponse.ok(res, updated);
});

export const setPrimaryPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.setPrimary(req.params.id as string, req.workspaceId);

  return ApiResponse.ok(res, method);
});

export const createDefaultBankTransfer = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.createDefaultBankTransfer(req.userId, req.workspaceId);

  return ApiResponse.created(res, method);
});

export const deletePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  await paymentMethodService.deleteById(
    req.params.id as string,
    req.workspaceId,
    req.body?.replacementId as string | undefined
  );

  return ApiResponse.deleted(res, 'Payment method deleted successfully');
});
