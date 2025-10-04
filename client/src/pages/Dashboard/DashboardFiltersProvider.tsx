import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AccountDto } from '@/types/Account';
import { useAccounts } from '@/hooks/useAccounts';

interface DashboardFiltersContextValue {
  date: Dayjs;
  setDate: (date: Dayjs) => void;
  year: number;
  month: number;
  account: AccountDto | undefined;
  setAccount: (account: AccountDto) => void;
}

const DashboardFiltersContext = createContext<DashboardFiltersContextValue | undefined>(undefined);

export const DashboardFiltersProvider = ({ children }: { children: ReactNode }) => {
  const { accounts } = useAccounts();
  const [date, setDate] = useState(dayjs());
  const [account, setAccount] = useState<AccountDto | undefined>();

  const value: DashboardFiltersContextValue = {
    date,
    setDate,
    year: date.year(),
    month: date.month(),
    account,
    setAccount,
  };

  useEffect(() => {
    if (accounts.length && !account) {
      const primary = accounts.find(x => x.isPrimary);
      setAccount(primary);
    }
  }, [account, accounts]);

  return (
    <DashboardFiltersContext.Provider value={value}>{children}</DashboardFiltersContext.Provider>
  );
};

export const useDashboardFilters = () => {
  const ctx = useContext(DashboardFiltersContext);

  if (!ctx) {
    throw new Error('useDashboardFilters must be used within DashboardFiltersProvider');
  }

  return ctx;
};
