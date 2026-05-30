import dayjs, { Dayjs } from 'dayjs';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAccounts } from '@/hooks/entities/useAccounts';
import { useCategories } from '@/hooks/entities/useCategories';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
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
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { paymentMethods } = usePaymentMethods();
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

  useEffect(() => {
    if (categories.length === 0 || selectedCategoryIds.length === 0) {
      return;
    }

    const validIds = new Set(categories.map(c => c._id));
    const filtered = selectedCategoryIds.filter(id => validIds.has(id));

    if (filtered.length !== selectedCategoryIds.length) {
      setSelectedCategoryIds(filtered);
    }
  }, [categories, selectedCategoryIds]);

  useEffect(() => {
    if (accounts.length === 0 || selectedAccountIds.length === 0) {
      return;
    }

    const validIds = new Set(accounts.map(a => a._id));
    const filtered = selectedAccountIds.filter(id => validIds.has(id));

    if (filtered.length !== selectedAccountIds.length) {
      setSelectedAccountIds(filtered);
    }
  }, [accounts, selectedAccountIds]);

  useEffect(() => {
    if (paymentMethods.length === 0 || selectedPaymentMethodIds.length === 0) {
      return;
    }

    const validIds = new Set(paymentMethods.map(p => p._id));
    const filtered = selectedPaymentMethodIds.filter(id => validIds.has(id));

    if (filtered.length !== selectedPaymentMethodIds.length) {
      setSelectedPaymentMethodIds(filtered);
    }
  }, [paymentMethods, selectedPaymentMethodIds]);

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
