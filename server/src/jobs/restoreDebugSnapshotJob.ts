import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import * as accountRepository from '../repositories/accountRepository';
import * as debugSnapshotRepository from '../repositories/debugSnapshotRepository';
import * as recurringTemplateRepository from '../repositories/recurringTemplateRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import { findByEmail } from '../repositories/userRepository';

const DEBUG_EMAIL = 'orharush24@gmail.com';

interface RestoreDebugSnapshotInput {
  snapshotId?: string;
}

export interface RestoreDebugSnapshotSummary {
  snapshotId: string;
  restoredCounts: {
    tx: number;
    accounts: number;
    templates: number;
    failed: number;
  };
  durationMs: number;
}

export const restoreDebugSnapshot = async ({
  snapshotId,
}: RestoreDebugSnapshotInput = {}): Promise<RestoreDebugSnapshotSummary> => {
  const start = Date.now();
  const user = await findByEmail(DEBUG_EMAIL);

  if (!user) {
    throw ApiError.notFound(`Debug user not found: ${DEBUG_EMAIL}`);
  }

  const userId = user._id.toString();

  const snapshot = snapshotId
    ? await debugSnapshotRepository.findById(snapshotId, userId)
    : await debugSnapshotRepository.findLatestActiveByUser(userId);

  if (!snapshot) {
    throw ApiError.notFound('No snapshot to restore');
  }

  if (snapshot.restoredAt !== null) {
    throw ApiError.badRequest('Snapshot already restored');
  }

  let failed = 0;
  let txCount = 0;
  let accountsRestored = 0;
  let templatesRestored = 0;

  if (snapshot.createdTxIds.length > 0) {
    try {
      const result = await transactionRepository.deleteMany({
        userId: new Types.ObjectId(userId),
        _id: { $in: snapshot.createdTxIds },
      });
      txCount = result?.deletedCount ?? 0;
    } catch (err) {
      failed++;
      console.error('[restore-debug-snapshot] tx deleteMany failed', err);
    }
  }

  for (const acc of snapshot.accounts) {
    try {
      const updated = await accountRepository.updateById(
        acc._id.toString(),
        {
          balance: acc.balance,
          checkpointBalance: acc.checkpointBalance,
          checkpointDate: acc.checkpointDate ?? undefined,
        },
        userId
      );

      if (updated) {
        accountsRestored++;
      }
    } catch (err) {
      failed++;
      console.error('[restore-debug-snapshot] account restore failed', {
        accountId: acc._id.toString(),
        err,
      });
    }
  }

  for (const tpl of snapshot.templates) {
    try {
      const updated = await recurringTemplateRepository.updateById(
        tpl._id.toString(),
        { lastGeneratedDate: tpl.lastGeneratedDate ?? null },
        userId
      );

      if (updated) {
        templatesRestored++;
      }
    } catch (err) {
      failed++;
      console.error('[restore-debug-snapshot] template restore failed', {
        templateId: tpl._id.toString(),
        err,
      });
    }
  }

  await debugSnapshotRepository.markRestored(snapshot._id.toString());

  const summary: RestoreDebugSnapshotSummary = {
    snapshotId: snapshot._id.toString(),
    restoredCounts: {
      tx: txCount,
      accounts: accountsRestored,
      templates: templatesRestored,
      failed,
    },
    durationMs: Date.now() - start,
  };

  console.log(
    `[restore-debug-snapshot] snapshot=${summary.snapshotId} tx=${txCount} accounts=${accountsRestored} templates=${templatesRestored} failed=${failed} duration=${summary.durationMs}ms`
  );

  return summary;
};
