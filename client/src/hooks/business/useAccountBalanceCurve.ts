import { useFetch } from '@/hooks/useFetch';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';

export interface BalancePoint {
  date: string;
  balance: number;
}

export const useAccountBalanceCurve = (accountId: string, from?: string, to?: string) => {
  const params = new URLSearchParams();

  if (from) {
    params.append('from', from);
  }

  if (to) {
    params.append('to', to);
  }

  return useFetch<BalancePoint[]>({
    url: `${API_ROUTES.ACCOUNT_BALANCE_CURVE(accountId)}?${params.toString()}`,
    queryKey: queryKeys.accountBalanceCurve(accountId, from, to),
    enabled: !!accountId,
  });
};
