import CreateTransactionDialog from '@/components/Dialogs/TransactionDialogs/CreateTransactionDialog';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import EditTransactionDialog from '@/components/Dialogs/TransactionDialogs/EditTransactionDialog';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { Button, DialogContent, Typography } from '@mui/material';
import { ROUTES } from '@/constants/Routes';
import FinSightDialog from '@/components/Dialogs/FinSightDialog';

interface TransactionDialogsProps {
  isCreateDialogOpen: boolean;
  closeCreateDialog: () => void;
}

const TransactionDialogs = ({ isCreateDialogOpen, closeCreateDialog }: TransactionDialogsProps) => {
  const { selectedTransaction, setSelectedTransaction } = useSelectedTransaction();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const needsSetup = !accounts?.length || !categories?.length;

  if (needsSetup) {
    return (
      <FinSightDialog
        title={'Complete Setup First'}
        isOpen={isCreateDialogOpen}
        closeDialog={closeCreateDialog}
      >
        <DialogContent
          sx={{
            p: 2,
            pt: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            You need to create at least one{' '}
            <Button
              variant="text"
              color="primary"
              size="small"
              sx={{ p: 0, height: '100%', minWidth: 'unset' }}
              onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
            >
              Account
            </Button>{' '}
            and one{' '}
            <Button
              variant="text"
              color="primary"
              size="small"
              sx={{ p: 0, height: '100%', minWidth: 'unset' }}
              onClick={() => navigate(ROUTES.CATEGORIES_URL)}
            >
              Category
            </Button>{' '}
            before you can add a transaction.
          </Typography>
        </DialogContent>
      </FinSightDialog>
    );
  }
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
