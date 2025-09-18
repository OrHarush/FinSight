import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { AccountDto } from '@/types/Account';
import { API_ROUTES } from '@/constants/APP_ROUTES';
import { AxiosError } from 'axios';

interface AccountsContextValue {
  accounts: AccountDto[];
  isLoading: boolean;
  error: AxiosError<unknown, any> | null;
  refetch: () => void;
}

const AccountsContext = createContext<AccountsContextValue | undefined>(undefined);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useFetch<AccountDto[]>({
    url: API_ROUTES.ACCOUNTS,
  });
  const [accounts, setAccounts] = useState<AccountDto[]>([]);

  useEffect(() => {
    if (data) {
      setAccounts(data);
    }
  }, [data]);

  return (
    <AccountsContext.Provider value={{ accounts, isLoading, error, refetch }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const ctx = useContext(AccountsContext);

  if (!ctx) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }

  return ctx;
};
