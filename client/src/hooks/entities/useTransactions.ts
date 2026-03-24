import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useAuth } from '@/providers/AuthProvider';
import { TransactionDto } from '@/types/Transaction';

export const useTransactions = (
  year?: number,
  month?: number,
  search?: string,
  categoryIds?: string[],
  accountIds?: string[],
  paymentMethodIds?: string[],
  page: number = 1,
  limit?: number
) => {
  const { user } = useAuth();

  const today = new Date();
  const selectedYear = year ?? today.getFullYear();
  const selectedMonth = month ?? today.getMonth();

  const params = new URLSearchParams({
    year: selectedYear.toString(),
    month: (selectedMonth + 1).toString(),
    page: page.toString(),
  });

  if (categoryIds?.length) {
    params.append('categoryIds', categoryIds.join(','));
  }

  if (accountIds?.length) {
    params.append('accountIds', accountIds.join(','));
  }

  if (paymentMethodIds?.length) {
    params.append('paymentMethodIds', paymentMethodIds.join(','));
  }

  if (limit !== undefined) {
    params.append('limit', limit.toString());
  }

  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  const url = `${API_ROUTES.TRANSACTIONS}?${params.toString()}`;

  const query = useFetch<{
    data: TransactionDto[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>({
    url,
    queryKey: queryKeys.transactions({
      year: selectedYear,
      month: selectedMonth,
      categoryIds,
      accountIds,
      paymentMethodIds,
      page,
      limit,
      search,
    }),
    enabled: !!user,
  });

  return {
    ...query,
    transactions: query.data?.data ?? [],
    pagination: query.data?.pagination,
  };
};
