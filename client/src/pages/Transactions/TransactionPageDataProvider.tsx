import { createContext, ReactNode, useContext, useState } from 'react';
import { ExpandedTransactionDto } from '@/types/Transaction';

type TransactionAction = undefined | 'edit' | 'delete';

interface SelectedTransactionContextValue {
  selectedTransaction?: ExpandedTransactionDto;
  setSelectedTransaction: (tx?: ExpandedTransactionDto) => void;
  transactionAction?: TransactionAction;
  setTransactionAction: (action?: TransactionAction) => void;
}

const SelectedTransactionContext = createContext<SelectedTransactionContextValue | undefined>(
  undefined
);

export const TransactionPageDataProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<ExpandedTransactionDto>();
  const [transactionAction, setTransactionAction] = useState<TransactionAction>();

  return (
    <SelectedTransactionContext.Provider
      value={{
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

export const useTransactinPageData = () => {
  const ctx = useContext(SelectedTransactionContext);

  if (!ctx) {
    throw new Error('useSelectedTransaction must be used within a SelectedTransactionProvider');
  }

  return ctx;
};
