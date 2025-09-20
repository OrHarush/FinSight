import { useOpen } from '@/hooks/useOpen';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/Layout/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { SelectedTransactionProvider } from '@/pages/Transactions/SelectedTransactionProvider';
import TransactionDialog from '@/pages/Transactions/TransactionDialog';

export const Transactions = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  return (
    <PageLayout>
      <SelectedTransactionProvider>
        <TransactionsHeader openCreateTransaction={openDialog} />
        <TransactionsPreview />
        <TransactionDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
      </SelectedTransactionProvider>
    </PageLayout>
  );
};
