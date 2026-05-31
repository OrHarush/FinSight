import { BalanceBreakdownResult } from '@lyra/shared';

import { ApiError } from '../errors/ApiError';
import * as accountRepository from '../repositories/accountRepository';
import { findByEmail } from '../repositories/userRepository';
import { computeAccountBalance } from '../services/balanceService';
import { resolveWorkspaceForRequest } from '../services/workspaceService';

const DEBUG_EMAIL = 'orharush24@gmail.com';

interface RunBreakdownInput {
  accountId?: string;
}

export const runBalanceBreakdownJob = async ({
  accountId,
}: RunBreakdownInput = {}): Promise<BalanceBreakdownResult> => {
  const user = await findByEmail(DEBUG_EMAIL);

  if (!user) {
    throw ApiError.notFound(`Debug user not found: ${DEBUG_EMAIL}`);
  }

  const userId = user._id.toString();
  const workspaceId = (await resolveWorkspaceForRequest(userId)).toString();

  const resolvedAccountId = await resolveAccountId(workspaceId, accountId);

  return computeAccountBalance(workspaceId, resolvedAccountId);
};

const resolveAccountId = async (workspaceId: string, requested?: string): Promise<string> => {
  if (requested) {
    const account = await accountRepository.findById(requested, workspaceId);

    if (!account) {
      throw ApiError.notFound('Account not found for debug user');
    }

    return account._id.toString();
  }

  const primary = await accountRepository.findPrimary(workspaceId);

  if (!primary) {
    throw ApiError.notFound('No primary account for debug user');
  }

  return primary._id.toString();
};
