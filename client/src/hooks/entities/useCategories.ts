import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/providers/AuthProvider';
import { CategoryDto } from '@/types/Category';

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
