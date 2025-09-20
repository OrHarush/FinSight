import CreateTransactionDialog from '@/components/Dialogs/TransactionDialogs/CreateTransactionDialog';
import EditTransactionDialog from '@/components/Dialogs/TransactionDialogs/EditTransactionDialog';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import { DialogProps } from '@/components/Dialogs/FormDialog';

const TransactionDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const { selectedTransaction, setSelectedTransaction } = useSelectedTransaction();
  const closeEditDialogAndReset = () => {
    setSelectedTransaction(undefined);
  };

  return (
    <>
      <CreateTransactionDialog isOpen={isOpen} closeDialog={closeDialog} />
      {selectedTransaction && (
        <EditTransactionDialog
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          closeDialog={closeEditDialogAndReset}
        />
      )}
    </>
  );
};

export default TransactionDialog;
