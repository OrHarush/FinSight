import { findAllActiveUserIds } from '../repositories/userRepository';
import { syncAllAccountsForUser } from '../services/balanceService';

export interface BalanceSyncJobSummary {
  usersProcessed: number;
  succeeded: number;
  failed: number;
  durationMs: number;
}

export const runBalanceSyncJob = async (): Promise<BalanceSyncJobSummary> => {
  const start = Date.now();
  const userIds = await findAllActiveUserIds();
  let succeeded = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      await syncAllAccountsForUser(userId);
      succeeded++;
    } catch (err) {
      failed++;
      console.error('[balance-sync-job] user failed', { userId, err });
    }
  }

  const durationMs = Date.now() - start;
  const summary: BalanceSyncJobSummary = {
    usersProcessed: userIds.length,
    succeeded,
    failed,
    durationMs,
  };

  console.log(
    `[balance-sync-job] processed=${summary.usersProcessed} succeeded=${succeeded} failed=${failed} duration=${durationMs}ms`
  );

  return summary;
};
