import { createContext, ReactNode, useContext, useState } from 'react';
import { ExtendedTransaction } from '@/types/Transaction';

interface SelectedTransactionContextValue {
  selectedTransaction?: ExtendedTransaction;
  setSelectedTransaction: (tx?: ExtendedTransaction) => void;
}

const SelectedTransactionContext = createContext<SelectedTransactionContextValue | undefined>(
  undefined
);

export const SelectedTransactionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<ExtendedTransaction>();

  return (
    <SelectedTransactionContext.Provider value={{ selectedTransaction, setSelectedTransaction }}>
      {children}
    </SelectedTransactionContext.Provider>
  );
};

export const useSelectedTransaction = () => {
  const ctx = useContext(SelectedTransactionContext);

  if (!ctx) {
    throw new Error('useSelectedTransaction must be used within a SelectedTransactionProvider');
  }

  return ctx;
};
