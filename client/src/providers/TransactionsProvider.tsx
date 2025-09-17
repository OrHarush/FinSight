import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { TransactionDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/APP_ROUTES';
import { AxiosError } from 'axios';

interface TransactionsContextValue {
  transactions: TransactionDto[];
  isLoading: boolean;
  error: AxiosError<unknown, any> | null;
  refetch: () => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useFetch<TransactionDto[]>({
    url: API_ROUTES.TRANSACTIONS,
  });
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);

  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data]);

  return (
    <TransactionsContext.Provider value={{ transactions, isLoading, error, refetch }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);

  if (!ctx) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }

  return ctx;
};
