import { toCents } from '@finsight/shared';
import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { ITransaction } from '../models/Transaction';
import * as accountRepository from '../repositories/accountRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { ImportTransactionsDTO } from '../schemas/importSchemas';
import { parseFile } from '../utils/fileParser';

export interface ImportPreview {
  rowCount: number;
  dateRange: { from: string; to: string } | null;
  rows: Array<{ date: string; name: string; amount: number }>;
  sample: Array<{ date: string; name: string; amount: number }>;
  warnings: string[];
}

export const getImportPreview = async (file: Express.Multer.File): Promise<ImportPreview> => {
  const { rows, warnings } = parseFile(file.buffer, file.mimetype);

  if (rows.length === 0) {
    warnings.push('No valid rows found after parsing.');
    return { rowCount: 0, dateRange: null, sample: [], warnings };
  }

  // ISO date strings (YYYY-MM-DD) sort lexicographically = chronologically
  const dates = rows.map(r => r.date).sort();
  const dateRange = { from: dates[0], to: dates[dates.length - 1] };

  const sample = rows.slice(0, 5);

  return {
    rowCount: rows.length,
    dateRange,
    rows,
    sample,
    warnings,
  };
};

export interface ImportResult {
  inserted: number;
  skipped: number;
  failed: number;
}

export const importTransactions = async (
  dto: ImportTransactionsDTO,
  userId: string
): Promise<ImportResult> => {
  const account = await accountRepository.findById(dto.accountId, userId);

  if (!account) {
    throw ApiError.notFound('Account not found.');
  }

  if (dto.paymentMethodId) {
    const paymentMethod = await paymentMethodRepository.findById(dto.paymentMethodId, userId);

    if (!paymentMethod) {
      throw ApiError.notFound('Payment method not found.');
    }
  }

  const { rows, dateFilter } = dto;
  let skipped = 0;

  const filteredRows = dateFilter
    ? rows.filter(row => {
        const inRange = row.date >= dateFilter.from && row.date <= dateFilter.to;

        if (!inRange) {
          skipped++;
        }

        return inRange;
      })
    : rows;

  if (filteredRows.length === 0) {
    return { inserted: 0, skipped, failed: 0 };
  }

  const transactions: Omit<ITransaction, '_id'>[] = filteredRows.map(row => {
    const isRefund = row.amount < 0;

    return {
      name: row.name.slice(0, 50) || undefined,
      type: isRefund ? 'Income' : 'Expense',
      amount: toCents(Math.abs(row.amount)),
      date: new Date(row.date),
      account: new Types.ObjectId(dto.accountId),
      ...(dto.paymentMethodId && { paymentMethod: new Types.ObjectId(dto.paymentMethodId) }),
      userId: new Types.ObjectId(userId),
    };
  });

  try {
    const result = await transactionRepository.insertMany(transactions);
    return { inserted: result.length, skipped, failed: 0 };
  } catch (err: unknown) {
    // Mongoose/MongoDB BulkWriteError with ordered:false: some docs may have been inserted.
    // The error exposes `insertedDocs` for the successful subset.
    if (
      err !== null &&
      typeof err === 'object' &&
      'insertedDocs' in err &&
      Array.isArray((err as { insertedDocs: unknown[] }).insertedDocs)
    ) {
      const inserted = (err as { insertedDocs: unknown[] }).insertedDocs.length;
      return { inserted, skipped, failed: filteredRows.length - inserted };
    }

    throw ApiError.internal('Failed to insert transactions.');
  }
};
