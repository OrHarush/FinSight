import { Types } from 'mongoose';

import * as accountRepository from '../repositories/accountRepository';
import * as debugSnapshotRepository from '../repositories/debugSnapshotRepository';
import * as recurringTemplateRepository from '../repositories/recurringTemplateRepository';
import { findByEmail } from '../repositories/userRepository';
import { syncAllAccountsForUser } from '../services/balanceService';
import { generatePendingTransactions } from '../services/recurringTemplateService';

const DEBUG_EMAIL = 'orharush24@gmail.com';

export interface DebugUserRunSummary {
  email: string;
  userId: string | null;
  found: boolean;
  snapshotId: string | null;
  createdTxIds: string[];
  balanceSynced: boolean;
  durationMs: number;
}

export const runForDebugUser = async (): Promise<DebugUserRunSummary> => {
  const start = Date.now();
  const user = await findByEmail(DEBUG_EMAIL);

  if (!user) {
    console.warn(`[run-for-debug-user] user not found for email=${DEBUG_EMAIL}`);

    return {
      email: DEBUG_EMAIL,
      userId: null,
      found: false,
      snapshotId: null,
      createdTxIds: [],
      balanceSynced: false,
      durationMs: Date.now() - start,
    };
  }

  const userId = user._id.toString();

  const [accounts, templates] = await Promise.all([
    accountRepository.findMany(userId),
    recurringTemplateRepository.findMany(userId),
  ]);

  const snapshot = await debugSnapshotRepository.insert({
    userId,
    reason: 'debug-run-for-me',
    accounts: accounts.map(a => ({
      _id: new Types.ObjectId(String(a._id)),
      balance: a.balance,
      checkpointBalance: a.checkpointBalance,
      checkpointDate: a.checkpointDate ?? null,
    })),
    templates: templates.map(t => ({
      _id: new Types.ObjectId(String(t._id)),
      lastGeneratedDate: t.lastGeneratedDate ?? null,
    })),
  });

  const snapshotId = snapshot._id.toString();

  const created = await generatePendingTransactions(userId);
  await syncAllAccountsForUser(userId);

  if (created.length > 0) {
    await debugSnapshotRepository.appendCreatedTxIds(
      snapshotId,
      created.map(tx => new Types.ObjectId(String(tx._id)))
    );
  }

  const summary: DebugUserRunSummary = {
    email: DEBUG_EMAIL,
    userId,
    found: true,
    snapshotId,
    createdTxIds: created.map(tx => String(tx._id)),
    balanceSynced: true,
    durationMs: Date.now() - start,
  };

  console.log(
    `[run-for-debug-user] email=${DEBUG_EMAIL} userId=${userId} snapshot=${snapshotId} createdTxs=${summary.createdTxIds.length} duration=${summary.durationMs}ms`
  );

  return summary;
};
