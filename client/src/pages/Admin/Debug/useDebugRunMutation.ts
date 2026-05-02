import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { DebugRunResultDto } from '@/types/AdminDebug';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const useDebugRunMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<DebugRunResultDto> => {
      const response = await api.post<ApiEnvelope<DebugRunResultDto>>(
        API_ROUTES.ADMIN_DEBUG.RUN_FOR_ME
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDebugSnapshots() });
    },
  });
};
