import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useAuth } from '@/providers/AuthProvider';
import { CategoryDto } from '@/types/Category';
import { useFetch } from '@/hooks/common/useFetch';

export const useCategories = () => {
  const { user } = useAuth();

  const query = useFetch<CategoryDto[]>({
    url: API_ROUTES.CATEGORIES,
    queryKey: queryKeys.categories(),
    enabled: !!user,
  });

  return {
    ...query,
    categories: query.data ?? [],
  };
};
