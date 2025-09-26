import { useOpen } from '@/hooks/useOpen';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/Layout/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { SelectedTransactionProvider } from '@/pages/Transactions/SelectedTransactionProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';

export const Transactions = () => {
  const [isCreateDialogOpen, openDialog, closeCreateDialog] = useOpen();

  return (
    <PageLayout>
      <SelectedTransactionProvider>
        <TransactionsHeader openCreateTransaction={openDialog} />
        <TransactionsPreview />
        <TransactionDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          closeCreateDialog={closeCreateDialog}
        />
      </SelectedTransactionProvider>
    </PageLayout>
  );
};
