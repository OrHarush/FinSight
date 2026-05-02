import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { DebugRestoreResultDto } from '@/types/AdminDebug';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface RestoreVariables {
  snapshotId?: string;
}

export const useDebugRestoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ snapshotId }: RestoreVariables): Promise<DebugRestoreResultDto> => {
      const response = await api.post<ApiEnvelope<DebugRestoreResultDto>>(
        API_ROUTES.ADMIN_DEBUG.RESTORE_FOR_ME,
        snapshotId ? { snapshotId } : {}
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDebugSnapshots() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allTransactions() });
    },
  });
};
