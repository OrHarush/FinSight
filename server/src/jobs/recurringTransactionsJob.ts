import { findUserIdsWithActiveTemplates } from '../repositories/recurringTemplateRepository';
import { syncAllAccountsForUser } from '../services/balanceService';
import { generatePendingTransactions } from '../services/recurringTemplateService';

export interface RecurringJobUserResult {
  userId: string;
  createdTxIds: string[];
}

export interface RecurringJobSummary {
  usersProcessed: number;
  succeeded: number;
  failed: number;
  durationMs: number;
  users: RecurringJobUserResult[];
}

export const runRecurringTransactionsJob = async (): Promise<RecurringJobSummary> => {
  const start = Date.now();
  const userIds = await findUserIdsWithActiveTemplates();
  const users: RecurringJobUserResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      const created = await generatePendingTransactions(userId);
      await syncAllAccountsForUser(userId);
      succeeded++;

      if (created.length > 0) {
        users.push({
          userId,
          createdTxIds: created.map(tx => String(tx._id)),
        });
      }
    } catch (err) {
      failed++;
      console.error('[recurring-tx-job] user failed', { userId, err });
    }
  }

  const durationMs = Date.now() - start;
  const summary: RecurringJobSummary = {
    usersProcessed: userIds.length,
    succeeded,
    failed,
    durationMs,
    users,
  };

  console.log(
    `[recurring-tx-job] processed=${summary.usersProcessed} succeeded=${succeeded} failed=${failed} duration=${durationMs}ms`
  );

  return summary;
};
