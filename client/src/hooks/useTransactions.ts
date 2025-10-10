import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useFetch } from '@/hooks/useFetch';
import { TransactionDto } from '@/types/Transaction';
import { useAuth } from '@/providers/AuthProvider';

export const useTransactions = (
  year?: number,
  month?: number,
  page: number = 1,
  limit: number = 20
) => {
  const { user } = useAuth();

  const today = new Date();
  const selectedYear = year ?? today.getFullYear();
  const selectedMonth = month ?? today.getMonth();

  const query = useFetch<TransactionDto[]>({
    url: `${API_ROUTES.TRANSACTIONS}?year=${selectedYear}&month=${selectedMonth + 1}`,
    queryKey: queryKeys.transactions({ year: selectedYear, month: selectedMonth, page, limit }),
    enabled: !!user,
  });

  return {
    ...query,
    transactions: query.data ?? [],
  };
};
