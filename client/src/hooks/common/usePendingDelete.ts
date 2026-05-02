import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse, PaginationMeta } from '@/hooks/common/useFetch';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ExpandedTransactionDto, TransactionDto } from '@/types/Transaction';

type CacheSnapshot = [readonly unknown[], ApiResponse<{ data: TransactionDto[]; pagination?: PaginationMeta }> | undefined][];

interface PendingDelete {
  transactionId: string;
  executeDelete: () => Promise<void>;
  restoreCache: () => void;
  buildDeleteUrl: string;
}

const UNDO_DURATION = 5000;

export const usePendingDelete = () => {
  const queryClient = useQueryClient();
  const { alertError } = useSnackbar();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingDelete | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const invalidateAfterDelete = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.allTransactions() }),
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.quickChips() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts() }),
    ]);
  };

  const flushPendingDelete = useCallback(async () => {
    const pending = pendingRef.current;

    if (!pending) {
      return;
    }

    clearTimer();
    pendingRef.current = null;
    setPendingDelete(null);

    try {
      await pending.executeDelete();
      await invalidateAfterDelete();
    } catch {
      pending.restoreCache();
      alertError('');
    }
  }, []);

  const snapshotAndRemoveFromCache = (transactionId: string): CacheSnapshot => {
    const snapshot: CacheSnapshot = [];

    const queries = queryClient.getQueriesData<
      ApiResponse<{ data: TransactionDto[]; pagination?: PaginationMeta }>
    >({ queryKey: queryKeys.allTransactions() });

    for (const [key, data] of queries) {
      snapshot.push([key, data ? structuredClone(data) : undefined]);

      if (!data?.data?.data || !Array.isArray(data.data.data)) {
        continue;
      }

      queryClient.setQueryData(key, {
        ...data,
        data: {
          ...data.data,
          data: data.data.data.filter(
            (tx: TransactionDto) => tx._id !== transactionId && (tx as ExpandedTransactionDto).originalId !== transactionId
          ),
          pagination: data.data.pagination
            ? { ...data.data.pagination, total: Math.max(0, data.data.pagination.total - 1) }
            : undefined,
        },
      });
    }

    return snapshot;
  };

  const restoreCacheFromSnapshot = (snapshot: CacheSnapshot) => {
    for (const [key, data] of snapshot) {
      queryClient.setQueryData(key, data);
    }
  };

  const triggerDelete = useCallback(
    async (transaction: ExpandedTransactionDto, deleteAction: () => Promise<void>) => {
      if (pendingRef.current) {
        await flushPendingDelete();
      }

      const transactionId = transaction.originalId ?? transaction._id;
      const snapshot = snapshotAndRemoveFromCache(transactionId);

      const restoreCache = () => restoreCacheFromSnapshot(snapshot);

      const buildDeleteUrl = `${import.meta.env.VITE_API_URL}${API_ROUTES.TRANSACTIONS}/${transactionId}`;

      const pending: PendingDelete = {
        transactionId,
        executeDelete: deleteAction,
        restoreCache,
        buildDeleteUrl,
      };

      pendingRef.current = pending;
      setPendingDelete(pending);

      timeoutRef.current = setTimeout(async () => {
        if (pendingRef.current?.transactionId !== transactionId) {
          return;
        }

        pendingRef.current = null;
        setPendingDelete(null);

        try {
          await deleteAction();
          await invalidateAfterDelete();
        } catch {
          restoreCache();
        }
      }, UNDO_DURATION);
    },
    [flushPendingDelete]
  );

  const undoDelete = useCallback(() => {
    const pending = pendingRef.current;

    if (!pending) {
      return;
    }

    clearTimer();
    pending.restoreCache();
    pendingRef.current = null;
    setPendingDelete(null);
  }, []);

  const onExpire = useCallback(async () => {
    const pending = pendingRef.current;

    if (!pending) {
      return;
    }

    clearTimer();
    pendingRef.current = null;
    setPendingDelete(null);

    try {
      await pending.executeDelete();
      await invalidateAfterDelete();
    } catch {
      pending.restoreCache();
    }
  }, []);

  useEffect(() => {
    const flushOnUnload = () => {
      const pending = pendingRef.current;

      if (!pending) {
        return;
      }

      const token = localStorage.getItem('token');

      fetch(pending.buildDeleteUrl, {
        method: 'DELETE',
        keepalive: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      pendingRef.current = null;
    };

    window.addEventListener('beforeunload', flushOnUnload);

    return () => {
      window.removeEventListener('beforeunload', flushOnUnload);
      const pending = pendingRef.current;

      if (pending) {
        clearTimer();
        pendingRef.current = null;
        pending.executeDelete().then(() => invalidateAfterDelete());
      }
    };
  }, []);

  return { pendingDelete, triggerDelete, undoDelete, onExpire };
};
