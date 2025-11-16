import CreateTransactionDialog from '@/components/dialogs/TransactionDialogs/CreateTransactionDialog';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import EditTransactionDialog from '@/components/dialogs/TransactionDialogs/EditTransactionDialog';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { Button, DialogContent, Typography } from '@mui/material';
import { API_ROUTES, ROUTES } from '@/constants/Routes';
import FinSightDialog from '@/components/dialogs/FinSightDialog';
import { Trans, useTranslation } from 'react-i18next';
import DeletionConfirmationDialog from '@/components/dialogs/DeletionConfirmationDialog';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import TransactionOverview from '@/pages/Transactions/TransactionOverview';

interface TransactionDialogsProps {
  isCreateDialogOpen: boolean;
  closeCreateDialog: () => void;
}

const TransactionDialogs = ({ isCreateDialogOpen, closeCreateDialog }: TransactionDialogsProps) => {
  const { t } = useTranslation('transactions');
  const { selectedTransaction, setSelectedTransaction, transactionAction, setTransactionAction } =
    useSelectedTransaction();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useSnackbar();

  const needsSetup = !accounts?.length || !categories?.length;

  const resetSelectedTransaction = () => {
    console.log('leaving');
    setSelectedTransaction(undefined);
    setTransactionAction(undefined);
  };

  const deleteTransaction = useApiMutation<void, { id: string }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.TRANSACTIONS}/${id}`,
    queryKeysToInvalidate: [queryKeys.transactions()],
    options: {
      onSuccess: () => {
        alertSuccess(t('messages.deleteSuccess'));
      },
      onError: err => {
        alertError(t('messages.deleteError'));
        console.error('❌ Failed to delete transaction', err);
      },
    },
  });

  console.log(transactionAction);

  if (needsSetup) {
    return (
      <FinSightDialog
        title={t('setupDialog.title')}
        isOpen={isCreateDialogOpen}
        closeDialog={closeCreateDialog}
      >
        <DialogContent
          sx={{
            p: 4,
            pt: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <Trans
              ns="transactions"
              i18nKey="setupDialog.message"
              components={{
                account: (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{ p: 0, height: '100%', minWidth: 'unset' }}
                    onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
                  />
                ),
                category: (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{ p: 0, height: '100%', minWidth: 'unset' }}
                    onClick={() => navigate(ROUTES.CATEGORIES_URL)}
                  />
                ),
              }}
            />
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
      {!!selectedTransaction && transactionAction == 'edit' && (
        <EditTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={resetSelectedTransaction}
          transaction={selectedTransaction}
        />
      )}
      {!!selectedTransaction && transactionAction == 'delete' && (
        <DeletionConfirmationDialog
          isOpen={!!selectedTransaction}
          closeDialog={resetSelectedTransaction}
          onConfirm={() => {
            if (selectedTransaction) {
              deleteTransaction.mutate({
                id: selectedTransaction.originalId ?? selectedTransaction._id,
              });
            }
          }}
          entityType="transaction"
        />
      )}
      {!!selectedTransaction && !transactionAction && (
        <TransactionOverview
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(undefined)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionDialogs;
