import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { RetentionReportDto } from '@/types/Admin';

export const useRetention = () => {
  const { data, isLoading, isError, refetch } = useFetch<RetentionReportDto>({
    url: `${API_ROUTES.ADMIN}/retention`,
    queryKey: queryKeys.adminRetention(),
    refetchInterval: 60_000,
  });

  return { data, isLoading, isError, refetch };
};
