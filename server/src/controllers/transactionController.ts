import { CreateTransactionDTO, UpdateTransactionDTO } from '@lyra/shared';
import { Request, Response } from 'express';

import { ApiResponse } from '../http/ApiResponse';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ExportTransactionsQuery } from '../schemas/transactionExportSchemas';
import { GetTransactionsQuery, GetTransactionSummaryQuery } from '../schemas/transactionSchemas';
import * as exportTransactionsService from '../services/transactions/exportTransactionsService';
import * as quickChipsService from '../services/transactions/quickChipsService';
import * as transactionService from '../services/transactions/transactionService';

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const result = await transactionService.findAll(
    req.userId,
    req.validatedQuery as GetTransactionsQuery
  );

  return ApiResponse.ok(res, {
    data: result.data,
    pagination: result.pagination,
  });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionById(
    req.params.id as string,
    req.userId
  );

  return ApiResponse.ok(res, transaction);
});

export const getTransactionSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await transactionService.getTransactionSummary(
    req.userId,
    req.validatedQuery as GetTransactionSummaryQuery
  );

  return ApiResponse.ok(res, summary);
});

export const getTransactionCount = asyncHandler(async (req: Request, res: Response) => {
  const total = await transactionService.countAll(req.userId);

  return ApiResponse.ok(res, { total });
});

export const getQuickChips = asyncHandler(async (req: Request, res: Response) => {
  const chips = await quickChipsService.getQuickChips(req.userId);

  return ApiResponse.ok(res, chips);
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.create(
    req.validatedBody as CreateTransactionDTO,
    req.userId
  );

  return ApiResponse.created(res, transaction);
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const updatedTransaction = await transactionService.update(
    req.params.id as string,
    req.validatedBody as UpdateTransactionDTO,
    req.userId
  );

  return ApiResponse.ok(res, updatedTransaction);
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  await transactionService.deleteTransaction(req.params.id as string, req.userId);

  return ApiResponse.deleted(res, 'Transaction deleted successfully');
});

export const exportTransactions = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ExportTransactionsQuery;
  const buffer = await exportTransactionsService.exportByMonth(req.userId, query);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="lyra-transactions-${query.monthLabel}.xlsx"`
  );
  res.setHeader('Content-Length', buffer.length);

  return res.status(200).send(buffer);
});
