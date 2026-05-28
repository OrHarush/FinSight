import dayjs, { Dayjs } from 'dayjs';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ExpandedTransactionDto } from '@/types/Transaction';

const monthFromParam = (value: string | null): Dayjs | null => {
  const match = value ? /^(\d{4})-(\d{2})$/.exec(value) : null;

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return dayjs(new Date(year, monthIndex, 1));
};

const categoryIdsFromParam = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);
};

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
  const [searchParams] = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(
    () => monthFromParam(searchParams.get('month')) ?? dayjs()
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() =>
    categoryIdsFromParam(searchParams.get('categoryIds'))
  );
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
