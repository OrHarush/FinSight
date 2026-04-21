import type { QuickChipDto } from '@lyra/shared';
import { useQuery } from '@tanstack/react-query';

import api from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useAuth } from '@/providers/AuthProvider';

const FIVE_MINUTES = 5 * 60 * 1000;

export const useQuickChips = (enabled: boolean = true) => {
  const { user } = useAuth();

  const query = useQuery<QuickChipDto[]>({
    queryKey: queryKeys.quickChips(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<QuickChipDto[]>>(API_ROUTES.TRANSACTION_QUICK_CHIPS);

      if (!data.success) {
        throw new Error(data.error ?? 'Failed to load quick chips');
      }

      return data.data;
    },
    enabled: !!user && enabled,
    staleTime: FIVE_MINUTES,
  });

  return {
    ...query,
    chips: query.data ?? [],
  };
};
