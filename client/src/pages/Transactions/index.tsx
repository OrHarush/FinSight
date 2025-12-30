import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { TransactionPageDataProvider } from '@/pages/Transactions/TransactionPageDataProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import { useOpen } from '@/hooks/useOpen';
import ActionFab from '@/components/shared/ui/ActionFab';
import TransactionsFilters from '@/pages/Transactions/TransactionFilters';
import { FormProvider, useForm } from 'react-hook-form';

export const Transactions = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const methods = useForm();

  return (
    <PageLayout>
      <TransactionPageDataProvider>
        <FormProvider {...methods}>
          <TransactionsHeader openCreateTransaction={openCreateDialog} />
          <TransactionsFilters />
          <TransactionsPreview />
          <ActionFab onClick={openCreateDialog} />
          <TransactionDialogs
            isCreateDialogOpen={isCreateDialogOpen}
            closeCreateDialog={closeCreateDialog}
          />
        </FormProvider>
      </TransactionPageDataProvider>
    </PageLayout>
  );
};
