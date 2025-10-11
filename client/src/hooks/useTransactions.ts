import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useFetch } from '@/hooks/useFetch';
import { TransactionDto } from '@/types/Transaction';
import { useAuth } from '@/providers/AuthProvider';

export const useTransactions = (
  year?: number,
  month?: number,
  categoryId?: string,
  page: number = 1,
  limit: number = 20
) => {
  const { user } = useAuth();

  const today = new Date();
  const selectedYear = year ?? today.getFullYear();
  const selectedMonth = month ?? today.getMonth();

  const params = new URLSearchParams({
    year: selectedYear.toString(),
    month: (selectedMonth + 1).toString(),
    page: page.toString(),
    limit: limit.toString(),
  });

  if (categoryId) {
    params.append('categoryId', categoryId);
  }

  const url = `${API_ROUTES.TRANSACTIONS}?${params.toString()}`;

  const query = useFetch<TransactionDto[]>({
    url,
    queryKey: queryKeys.transactions({
      year: selectedYear,
      month: selectedMonth,
      page,
      limit,
      categoryId,
    }),
    enabled: !!user,
  });

  return {
    ...query,
    transactions: query.data ?? [],
  };
};
