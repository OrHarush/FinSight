import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { ExtendedTransaction, TransactionDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { AxiosError } from 'axios';
import { queryKeys } from '@/constants/queryKeys';
import { expandTransactions, sortTransactionsByDate } from '@/utils/transactionUtils';

interface TransactionsContextValue {
  transactions: ExtendedTransaction[];
  isLoading: boolean;
  error: AxiosError<unknown, unknown> | null;
  refetch: () => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useFetch<TransactionDto[]>({
    url: API_ROUTES.TRANSACTIONS,
    queryKey: queryKeys.transactions(),
  });
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);

  useEffect(() => {
    if (data) {
      const endOfYear = new Date(new Date().getFullYear(), 11, 31);
      setTransactions(sortTransactionsByDate(expandTransactions(data, endOfYear)));
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
