import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/layout/Page/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { SelectedTransactionProvider } from '@/pages/Transactions/SelectedTransactionProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useOpen } from '@/hooks/useOpen';
import ActionFab from '@/components/appCommon/ActionFab';
import TransactionsFilters from '@/pages/Transactions/TransactionsFilters';

export const Transactions = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <PageLayout>
      <SelectedTransactionProvider>
        <TransactionsHeader openCreateTransaction={openCreateDialog} />
        <ActionFab onClick={openCreateDialog} />
        <TransactionsFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <TransactionsPreview
          searchValue={searchValue}
          selectedCategory={selectedCategory}
          selectedMonth={selectedMonth}
        />
        <TransactionDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          closeCreateDialog={closeCreateDialog}
        />
      </SelectedTransactionProvider>
    </PageLayout>
  );
};
