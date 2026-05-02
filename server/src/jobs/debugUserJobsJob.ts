import { findByEmail } from '../repositories/userRepository';
import { syncAllAccountsForUser } from '../services/balanceService';
import { generatePendingTransactions } from '../services/recurringTemplateService';

const DEBUG_EMAIL = 'orharush24@gmail.com';

export interface DebugUserJobsSummary {
  email: string;
  userId: string | null;
  found: boolean;
  createdTxIds: string[];
  balanceSynced: boolean;
  durationMs: number;
}

export const runDebugUserJobs = async (): Promise<DebugUserJobsSummary> => {
  const start = Date.now();
  const user = await findByEmail(DEBUG_EMAIL);

  if (!user) {
    console.warn(`[debug-user-jobs] user not found for email=${DEBUG_EMAIL}`);

    return {
      email: DEBUG_EMAIL,
      userId: null,
      found: false,
      createdTxIds: [],
      balanceSynced: false,
      durationMs: Date.now() - start,
    };
  }

  const userId = user._id.toString();
  const created = await generatePendingTransactions(userId);
  await syncAllAccountsForUser(userId);

  const summary: DebugUserJobsSummary = {
    email: DEBUG_EMAIL,
    userId,
    found: true,
    createdTxIds: created.map(tx => String(tx._id)),
    balanceSynced: true,
    durationMs: Date.now() - start,
  };

  console.log(
    `[debug-user-jobs] email=${DEBUG_EMAIL} userId=${userId} createdTxs=${summary.createdTxIds.length} duration=${summary.durationMs}ms`
  );

  return summary;
};
