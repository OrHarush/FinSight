import { createContext, ReactNode, useContext, useState } from 'react';
import { ExpandedTransactionDto } from '@/types/Transaction';

interface SelectedTransactionContextValue {
  selectedTransaction?: ExpandedTransactionDto;
  setSelectedTransaction: (tx?: ExpandedTransactionDto) => void;
}

const SelectedTransactionContext = createContext<SelectedTransactionContextValue | undefined>(
  undefined
);

export const SelectedTransactionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<ExpandedTransactionDto>();

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
