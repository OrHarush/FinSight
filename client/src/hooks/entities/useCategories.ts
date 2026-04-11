import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useAuth } from '@/providers/AuthProvider';
import { CategoryDto } from '@/types/Category';

export const useCategories = () => {
  const { user } = useAuth();

  const query = useFetch<CategoryDto[]>({
    url: API_ROUTES.CATEGORIES,
    queryKey: queryKeys.categories(),
    enabled: !!user,
  });

  const categories = query.data ?? [];

  return {
    ...query,
    categories,
    expenseCategories: categories.filter(c => c.type === 'Expense'),
    incomeCategories: categories.filter(c => c.type === 'Income'),
  };
};
