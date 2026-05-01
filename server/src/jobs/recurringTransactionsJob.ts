import { findUserIdsWithActiveTemplates } from '../repositories/recurringTemplateRepository';
import { syncAllAccountsForUser } from '../services/balanceService';
import { generatePendingTransactions } from '../services/recurringTemplateService';

export interface RecurringJobSummary {
  usersProcessed: number;
  succeeded: number;
  failed: number;
  durationMs: number;
}

export const runRecurringTransactionsJob = async (): Promise<RecurringJobSummary> => {
  const start = Date.now();
  const userIds = await findUserIdsWithActiveTemplates();
  let succeeded = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      await generatePendingTransactions(userId);
      await syncAllAccountsForUser(userId);
      succeeded++;
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
  };

  console.log(
    `[recurring-tx-job] processed=${summary.usersProcessed} succeeded=${succeeded} failed=${failed} duration=${durationMs}ms`
  );

  return summary;
};
