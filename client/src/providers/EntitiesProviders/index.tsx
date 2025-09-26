import { TransactionsProvider } from '@/providers/EntitiesProviders/TransactionsProvider';
import { CategoriesProvider } from '@/providers/EntitiesProviders/CategoriesProvider';
import { AccountsProvider } from '@/providers/EntitiesProviders/AccountsProvider';
import { ReactNode } from 'react';

interface EntitiesProvidersProps {
  children?: ReactNode;
}

const EntitiesProviders = ({ children }: EntitiesProvidersProps) => {
  return (
    <TransactionsProvider>
      <CategoriesProvider>
        <AccountsProvider>{children}</AccountsProvider>
      </CategoriesProvider>
    </TransactionsProvider>
  );
};

export default EntitiesProviders;
