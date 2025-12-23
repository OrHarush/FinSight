import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AccountDto } from '@/types/Account';
import { useAccounts } from '@/hooks/entities/useAccounts';

interface OverviewFiltersContextValue {
  date: Dayjs;
  setDate: (date: Dayjs) => void;
  year: number;
  month: number;
  account: AccountDto | undefined;
  setAccount: (account: AccountDto) => void;
}

const OverviewFiltersContext = createContext<OverviewFiltersContextValue | undefined>(undefined);

export const OverviewFiltersProvider = ({ children }: { children: ReactNode }) => {
  const { accounts } = useAccounts();
  const [date, setDate] = useState(dayjs());
  const [account, setAccount] = useState<AccountDto | undefined>();

  const value: OverviewFiltersContextValue = {
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
    <OverviewFiltersContext.Provider value={value}>{children}</OverviewFiltersContext.Provider>
  );
};

export const useOverviewFilters = () => {
  const ctx = useContext(OverviewFiltersContext);

  if (!ctx) {
    throw new Error('useOverviewFilters must be used within OverviewFiltersProvider');
  }

  return ctx;
};
