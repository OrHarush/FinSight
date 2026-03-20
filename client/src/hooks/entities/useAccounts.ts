import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useAuth } from '@/providers/AuthProvider';
import { AccountDto } from '@/types/Account';

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

  const primaryAccount = accounts.find(({ isPrimary }) => isPrimary);

  return {
    ...query,
    accounts,
    primaryAccount,
  };
};
