import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit,
    sort = 'desc',
    categoryId,
    paymentMethodId,
    year,
    month,
    search,
  } = req.query;

  let fromDate: Date | undefined;
  let toDate: Date | undefined;
  let targetYear: number | undefined;
  let targetMonth: number | undefined;

  if (year && month) {
    const y = parseInt(year as string, 10);
    const m0 = parseInt(month as string, 10) - 1;

    targetYear = y;
    targetMonth = m0;

    fromDate = new Date(Date.UTC(y, m0, 1));
    toDate = new Date(Date.UTC(y, m0 + 2, 0, 23, 59, 59, 999));
  }

  const result = await transactionService.findAll(req.userId, {
    page: parseInt(page as string, 10),
    limit: limit ? parseInt(limit as string, 10) : undefined,
    from: fromDate,
    to: toDate,
    targetYear,
    targetMonth,
    sort: sort as 'asc' | 'desc',
    categoryId: categoryId as string | undefined,
    paymentMethodId: paymentMethodId as string | undefined,
    search: search as string | undefined,
  });

  return ApiResponse.ok(res, {
    data: result.data,
    pagination: result.pagination,
  });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionById(req.params.id, req.userId);

  return ApiResponse.ok(res, transaction);
});

export const getTransactionSummary = asyncHandler(async (req: Request, res: Response) => {
  const { year, month, accountId } = req.query;

  let summary;

  if (month !== undefined) {
    summary = await transactionService.getTransactionSummary(
      req.userId,
      Number(year),
      Number(month),
      accountId?.toString() || ''
    );
  } else {
    summary = await transactionService.getTransactionSummary(req.userId, Number(year));
  }

  return ApiResponse.ok(res, summary);
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.create(req.body, req.userId);

  return ApiResponse.created(res, transaction);
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const updatedTransaction = await transactionService.update(req.params.id, req.body, req.userId);

  return ApiResponse.ok(res, updatedTransaction);
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  await transactionService.deleteTransaction(req.params.id, req.userId);

  return ApiResponse.deleted(res, 'Transaction deleted successfully');
});
