import dayjs, { Dayjs } from 'dayjs';
import { createContext, ReactNode, useContext, useEffect,useState } from 'react';

import { useAccounts } from '@/hooks/entities/useAccounts';
import { AccountDto } from '@/types/Account';

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
  const [accountId, setAccountId] = useState<string | undefined>();

  const account = accountId ? accounts.find(a => a._id === accountId) : undefined;

  const setAccount = (next: AccountDto) => setAccountId(next._id);

  const value: OverviewFiltersContextValue = {
    date,
    setDate,
    year: date.year(),
    month: date.month(),
    account,
    setAccount,
  };

  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }

    const selectedStillBelongsToWorkspace =
      accountId && accounts.some(a => a._id === accountId);

    if (selectedStillBelongsToWorkspace) {
      return;
    }

    const primary = accounts.find(x => x.isPrimary);

    setAccountId(primary?._id ?? accounts[0]._id);
  }, [accountId, accounts]);

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
