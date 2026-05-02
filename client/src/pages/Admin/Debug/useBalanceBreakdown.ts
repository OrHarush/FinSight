import { BalanceBreakdownResult } from '@lyra/shared';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';

interface UseBalanceBreakdownOptions {
  enabled: boolean;
  accountId?: string;
}

export const useBalanceBreakdown = ({ enabled, accountId }: UseBalanceBreakdownOptions) =>
  useFetch<BalanceBreakdownResult>({
    url: API_ROUTES.ADMIN_DEBUG.BALANCE_BREAKDOWN(accountId),
    queryKey: queryKeys.adminBalanceBreakdown(accountId),
    enabled,
  });
