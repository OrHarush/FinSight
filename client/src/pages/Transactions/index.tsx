import { useOpen } from '@/hooks/useOpen';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import CreateTransactionDialog from '@/components/Dialogs/CreateTransactionDialog';
import PageLayout from '@/components/Layout/PageLayout';
import TransactionsTable from '@/pages/Transactions/TransactionsTable';

export const Transactions = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  return (
    <PageLayout>
      <TransactionsHeader openCreateTransaction={openDialog} />
      <TransactionsTable />
      <CreateTransactionDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
    </PageLayout>
  );
};
