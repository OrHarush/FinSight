import { toCents } from '@lyra/shared';
import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { ITransaction } from '../models/Transaction';
import * as accountRepository from '../repositories/accountRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { CheckDuplicatesDTO, ImportTransactionsDTO } from '../schemas/importSchemas';
import { FileFormat, parseFile } from '../utils/fileParser';
import { fingerprintForImportRow } from '../utils/importFingerprint';
import * as analyticsService from './analyticsService';
import { invalidateQuickChipsCache } from './transactions/quickChipsService';

interface PreviewRow {
  date: string;
  name: string;
  amount: number;
  card: string | null;
}

export interface ImportPreview {
  rowCount: number;
  dateRange: { from: string; to: string } | null;
  rows: PreviewRow[];
  sample: PreviewRow[];
  warnings: string[];
  cards: string[];
  cardCounts: Record<string, number>;
  format: FileFormat;
}

const summarizeCards = (rows: PreviewRow[]): { cards: string[]; cardCounts: Record<string, number> } => {
  const counts: Record<string, number> = {};
  const order: string[] = [];

  for (const row of rows) {
    if (row.card === null) {
      continue;
    }

    if (!(row.card in counts)) {
      counts[row.card] = 0;
      order.push(row.card);
    }

    counts[row.card]++;
  }

  return { cards: order, cardCounts: counts };
};

export const getImportPreview = async (file: Express.Multer.File): Promise<ImportPreview> => {
  const { rows, warnings, format } = parseFile(file.buffer, file.mimetype);

  if (rows.length === 0) {
    warnings.push('No valid rows found after parsing.');
    return {
      rowCount: 0,
      dateRange: null,
      rows: [],
      sample: [],
      warnings,
      cards: [],
      cardCounts: {},
      format,
    };
  }

  const dates = rows.map(r => r.date).sort();
  const dateRange = { from: dates[0], to: dates[dates.length - 1] };
  const sample = rows.slice(0, 5);
  const { cards, cardCounts } = summarizeCards(rows);

  return {
    rowCount: rows.length,
    dateRange,
    rows,
    sample,
    warnings,
    cards,
    cardCounts,
    format,
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

  const distinctPaymentMethodIds = Array.from(
    new Set(
      [dto.paymentMethodId, ...dto.rows.map(r => r.paymentMethodId)].filter(
        (id): id is string => typeof id === 'string' && id.length > 0
      )
    )
  );

  if (distinctPaymentMethodIds.length > 0) {
    const found = await paymentMethodRepository.findByIds(distinctPaymentMethodIds, userId);

    if (found.length !== distinctPaymentMethodIds.length) {
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

  const importBatchId = new Types.ObjectId();

  const transactions: Omit<ITransaction, '_id'>[] = filteredRows.map(row => {
    const isRefund = row.amount < 0;
    const paymentMethodId = row.paymentMethodId ?? dto.paymentMethodId;

    return {
      name: row.name.slice(0, 50) || '',
      type: isRefund ? 'Income' : 'Expense',
      amount: toCents(Math.abs(row.amount)),
      date: new Date(row.date),
      account: new Types.ObjectId(dto.accountId),
      ...(paymentMethodId && { paymentMethod: new Types.ObjectId(paymentMethodId) }),
      ...(row.categoryId && { category: new Types.ObjectId(row.categoryId) }),
      userId: new Types.ObjectId(userId),
      importBatchId,
      importFingerprint: fingerprintForImportRow(userId, dto.accountId, row),
    };
  });

  try {
    const result = await transactionRepository.insertMany(transactions);

    invalidateQuickChipsCache(userId);

    void analyticsService
      .track(userId, 'csv_imported')
      .catch(err => console.error('Failed to track csv_imported:', err));

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

      if (inserted > 0) {
        invalidateQuickChipsCache(userId);

        void analyticsService
          .track(userId, 'csv_imported')
          .catch(trackErr => console.error('Failed to track csv_imported:', trackErr));
      }

      return { inserted, skipped, failed: filteredRows.length - inserted };
    }

    throw ApiError.internal('Failed to insert transactions.');
  }
};

export interface DuplicateCheckResult {
  duplicateRowIndices: number[];
}

export const findDuplicates = async (
  dto: CheckDuplicatesDTO,
  userId: string
): Promise<DuplicateCheckResult> => {
  const fingerprints = dto.rows.map(row => fingerprintForImportRow(userId, dto.accountId, row));
  const uniqueFingerprints = [...new Set(fingerprints)];

  const existingFingerprints = await transactionRepository.findExistingFingerprints(
    userId,
    uniqueFingerprints
  );
  const existing = new Set(existingFingerprints);

  const duplicateRowIndices = fingerprints.reduce<number[]>((indices, fingerprint, index) => {
    if (existing.has(fingerprint)) {
      indices.push(index);
    }

    return indices;
  }, []);

  return { duplicateRowIndices };
};
