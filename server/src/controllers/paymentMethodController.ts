import { Request, Response } from 'express';
import * as paymentMethodService from '../services/paymentMethodService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const getPaymentMethods = asyncHandler(async (req: Request, res: Response) => {
  const methods = await paymentMethodService.findAll(req.userId);

  return ApiResponse.ok(res, methods);
});

export const getPaymentMethodById = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.getById(req.params.id, req.userId);

  return ApiResponse.ok(res, method);
});

export const createPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.create(req.body, req.userId);

  return ApiResponse.created(res, method);
});

export const updatePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const updated = await paymentMethodService.update(req.params.id, req.body, req.userId);

  return ApiResponse.ok(res, updated);
});

export const deletePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  await paymentMethodService.deleteById(req.params.id, req.userId);

  return ApiResponse.deleted(res, 'Payment method deleted successfully');
});
