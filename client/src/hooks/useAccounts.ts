import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useFetch } from '@/hooks/useFetch';
import { AccountDto } from '@/types/Account';
import { useAuth } from '@/providers/AuthProvider';

export const useAccounts = () => {
  const { user } = useAuth();

  const query = useFetch<AccountDto[]>({
    url: API_ROUTES.ACCOUNTS,
    queryKey: queryKeys.accounts(),
    enabled: !!user,
  });

  const accounts = query.data
    ? [...query.data].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    : [];

  return {
    ...query,
    accounts,
  };
};
