import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/useFetch';

export interface BudgetDto {
  _id: string;
  userId: string;
  categoryId: string;
  year: number;
  month: number;
  limit: number;
  createdAt: string;
  updatedAt: string;
}

export const useBudgets = (year?: number, month?: number, categoryId?: string) => {
  const params = new URLSearchParams();

  if (year !== undefined) {
    params.append('year', year.toString());
  }

  if (month !== undefined) {
    params.append('month', month.toString());
  }

  if (categoryId) {
    params.append('categoryId', categoryId);
  }

  const url = `${API_ROUTES.BUDGETS}?${params.toString()}`;

  const query = useFetch<BudgetDto[]>({
    url,
    queryKey: queryKeys.budgets(year, month, categoryId),
    enabled: year !== undefined && month !== undefined,
  });

  return {
    ...query,
    budgets: query.data ?? [],
  };
};
