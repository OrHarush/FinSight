import { FormProvider, useForm } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useOpen } from '@/hooks/common/useOpen';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import TransactionsFilters from '@/pages/Transactions/TransactionFilters';
import { TransactionPageDataProvider } from '@/pages/Transactions/TransactionPageDataProvider';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';

export const Transactions = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const methods = useForm();

  return (
    <PageLayout>
      <TransactionPageDataProvider>
        <FormProvider {...methods}>
          <Column height={'100%'} minHeight={0} spacing={2}>
            <TransactionsHeader openCreateTransaction={openCreateDialog} />
            <TransactionsFilters />
            <Column flex={1} minHeight={0}>
              <TransactionsPreview />
            </Column>
          </Column>
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

export default Transactions;
