import CreateTransactionDialog from '@/components/Dialogs/TransactionDialogs/CreateTransactionDialog';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import EditTransactionDialog from '@/components/Dialogs/TransactionDialogs/EditTransactionDialog';

interface TransactionDialogsProps {
  isCreateDialogOpen: boolean;
  closeCreateDialog: () => void;
}

const TransactionDialogs = ({ isCreateDialogOpen, closeCreateDialog }: TransactionDialogsProps) => {
  const { selectedTransaction, setSelectedTransaction } = useSelectedTransaction();

  return (
    <>
      {isCreateDialogOpen && (
        <CreateTransactionDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
      {!!selectedTransaction && (
        <EditTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={() => setSelectedTransaction(undefined)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionDialogs;
