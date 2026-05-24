import { toCents } from '@lyra/shared';
import { createHash } from 'crypto';
import { Types } from 'mongoose';

type TransactionType = 'Income' | 'Expense' | 'Transfer';

interface FingerprintParts {
  userId: string;
  accountId: string;
  dateYmd: string;
  signedCents: number;
}

export const dateToYmd = (date: Date): string => date.toISOString().slice(0, 10);

const computeImportFingerprint = (parts: FingerprintParts): string =>
  createHash('sha256')
    .update(`${parts.userId}|${parts.accountId}|${parts.dateYmd}|${parts.signedCents}`)
    .digest('hex');

export const fingerprintForImportRow = (
  userId: string,
  accountId: string,
  row: { date: string; amount: number }
): string => {
  const absCents = toCents(Math.abs(row.amount));
  const signedCents = row.amount < 0 ? absCents : -absCents;

  return computeImportFingerprint({
    userId,
    accountId,
    dateYmd: row.date.slice(0, 10),
    signedCents,
  });
};

interface TransactionFingerprintInput {
  userId: Types.ObjectId | string;
  account?: Types.ObjectId | string;
  date?: Date;
  amount: number;
  type: TransactionType;
}

export const fingerprintForTransaction = (
  tx: TransactionFingerprintInput
): string | undefined => {
  if (!tx.account || !tx.date) {
    return undefined;
  }

  const signedCents = tx.type === 'Income' ? tx.amount : -tx.amount;

  return computeImportFingerprint({
    userId: tx.userId.toString(),
    accountId: tx.account.toString(),
    dateYmd: dateToYmd(tx.date),
    signedCents,
  });
};
