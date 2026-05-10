import { CreateTransactionDTO } from '@lyra/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import api from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { TransactionMutationResult } from '@/types/Transaction';
import type { GhostContributionDto } from '@/types/Goal';

interface PendingContribution {
  transactionId: string;
  goalName: string;
  amount: number;
}

const TX_RELATED_KEYS = [
  queryKeys.allTransactions(),
  ['transactionSummary'],
  queryKeys.quickChips(),
  queryKeys.categories(),
  queryKeys.accounts(),
  queryKeys.allGoals(),
  queryKeys.allGoalGhosts(),
];

export const useGhostQuickContribute = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('goals');
  const { alertError } = useSnackbar();
  const { accounts, primaryAccount } = useAccounts();
  const { paymentMethods, primaryPaymentMethod } = usePaymentMethods();

  const [pending, setPending] = useState<PendingContribution | null>(null);
  const pendingRef = useRef<PendingContribution | null>(null);

  const createTransaction = useApiMutation<
    ApiResponse<TransactionMutationResult>,
    CreateTransactionDTO
  >({
    method: 'post',
    url: API_ROUTES.TRANSACTIONS,
    queryKeysToInvalidate: TX_RELATED_KEYS,
  });

  const updatePending = (next: PendingContribution | null) => {
    pendingRef.current = next;
    setPending(next);
  };

  const invalidateRelatedQueries = () =>
    Promise.all(TX_RELATED_KEYS.map(key => queryClient.invalidateQueries({ queryKey: key })));

  const contribute = async (ghost: GhostContributionDto) => {
    if (ghost.satisfied || ghost.remainingAmount <= 0) {
      return;
    }

    const account = primaryAccount ?? accounts[0];
    const paymentMethod = primaryPaymentMethod ?? paymentMethods[0];

    if (!account?._id || !paymentMethod?._id) {
      alertError(t('ghosts.errors.missingAccount'));

      return;
    }

    const payload: CreateTransactionDTO = {
      type: 'Expense',
      amount: ghost.remainingAmount,
      categoryId: ghost.categoryId,
      accountId: account._id,
      paymentMethodId: paymentMethod._id,
      date: new Date().toISOString(),
      name: t('ghosts.txName', { name: ghost.goalName }),
    };

    try {
      const response = await createTransaction.mutateAsync(payload);
      const createdId = response.data.transaction._id;

      updatePending({
        transactionId: createdId,
        goalName: ghost.goalName,
        amount: ghost.remainingAmount,
      });
    } catch (err) {
      console.error('Failed to contribute', err);
    }
  };

  const undo = async () => {
    const current = pendingRef.current;

    if (!current) {
      return;
    }

    updatePending(null);

    try {
      await api.delete(`${API_ROUTES.TRANSACTIONS}/${current.transactionId}`);
      await invalidateRelatedQueries();
    } catch (err) {
      console.error('Failed to undo contribution', err);
    }
  };

  const dismiss = () => updatePending(null);

  const defaultAccountId = (primaryAccount ?? accounts[0])?._id ?? '';
  const defaultPaymentMethodId = (primaryPaymentMethod ?? paymentMethods[0])?._id ?? '';

  return {
    contribute,
    undo,
    dismiss,
    pending,
    defaultAccountId,
    defaultPaymentMethodId,
  };
};
