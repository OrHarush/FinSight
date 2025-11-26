import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/layout/Page/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { TransactionPageDataProvider } from '@/pages/Transactions/TransactionPageDataProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useOpen } from '@/hooks/useOpen';
import ActionFab from '@/components/appCommon/ActionFab';
import TransactionsFilters from '@/pages/Transactions/TransactionFilters';
import { FormProvider, useForm } from 'react-hook-form';

export const Transactions = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const methods = useForm();

  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <PageLayout>
      <TransactionPageDataProvider>
        <FormProvider {...methods}>
          {/*<form>*/}
          <TransactionsHeader openCreateTransaction={openCreateDialog} />
          <TransactionsFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <TransactionsPreview selectedCategory={selectedCategory} selectedMonth={selectedMonth} />
          <ActionFab onClick={openCreateDialog} />
          <TransactionDialogs
            isCreateDialogOpen={isCreateDialogOpen}
            closeCreateDialog={closeCreateDialog}
          />
          {/*</form>*/}
        </FormProvider>
      </TransactionPageDataProvider>
    </PageLayout>
  );
};
