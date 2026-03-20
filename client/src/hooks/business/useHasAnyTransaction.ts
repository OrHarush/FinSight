import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useAuth } from '@/providers/AuthProvider';

export const useHasAnyTransaction = () => {
  const { user } = useAuth();

  const query = useFetch<{ total: number }>({
    url: `${API_ROUTES.TRANSACTIONS}/count`,
    queryKey: queryKeys.transactionsCount(),
    enabled: !!user,
  });

  return {
    hasAnyTransaction: (query.data?.total ?? 0) > 0,
    isLoading: query.isLoading,
  };
};
