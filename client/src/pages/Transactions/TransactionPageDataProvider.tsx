import dayjs, { Dayjs } from 'dayjs';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import { ExpandedTransactionDto } from '@/types/Transaction';

type TransactionAction = undefined | 'edit' | 'delete';

interface SelectedTransactionContextValue {
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (ids: string[]) => void;
  selectedAccountIds: string[];
  setSelectedAccountIds: (ids: string[]) => void;
  selectedPaymentMethodIds: string[];
  setSelectedPaymentMethodIds: (ids: string[]) => void;
  resetFilters: () => void;
  selectedMonth: Dayjs;
  setSelectedMonth: (selectedMonth: Dayjs) => void;
  selectedTransaction?: ExpandedTransactionDto;
  setSelectedTransaction: (tx?: ExpandedTransactionDto) => void;
  transactionAction?: TransactionAction;
  setTransactionAction: (action?: TransactionAction) => void;
}

const SelectedTransactionContext = createContext<SelectedTransactionContextValue | undefined>(
  undefined
);

export const TransactionPageDataProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [selectedPaymentMethodIds, setSelectedPaymentMethodIds] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<ExpandedTransactionDto>();
  const [transactionAction, setTransactionAction] = useState<TransactionAction>();

  const resetFilters = useCallback(() => {
    setSelectedCategoryIds([]);
    setSelectedAccountIds([]);
    setSelectedPaymentMethodIds([]);
  }, []);

  return (
    <SelectedTransactionContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        selectedCategoryIds,
        setSelectedCategoryIds,
        selectedAccountIds,
        setSelectedAccountIds,
        selectedPaymentMethodIds,
        setSelectedPaymentMethodIds,
        resetFilters,
        selectedTransaction,
        setSelectedTransaction,
        transactionAction,
        setTransactionAction,
      }}
    >
      {children}
    </SelectedTransactionContext.Provider>
  );
};

export const useTransactionPageData = () => {
  const ctx = useContext(SelectedTransactionContext);

  if (!ctx) {
    throw new Error('useSelectedTransaction must be used within a SelectedTransactionProvider');
  }

  return ctx;
};
