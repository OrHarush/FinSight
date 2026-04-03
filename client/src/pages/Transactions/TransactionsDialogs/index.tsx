import { useTranslation } from 'react-i18next';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useCategories } from '@/hooks/entities/useCategories';
import { useApiMutation } from '@/hooks/useApiMutation';
import EditTransactionDialog from '@/pages/Transactions/components/EditTransactionDialog';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import DeleteRecurringTransactionDialog from '@/pages/Transactions/TransactionsDialogs/DeleteRecurringTransactionDialog';
import DeleteTransactionDialog from '@/pages/Transactions/TransactionsDialogs/DeleteTransactionDialog';
import RequireSetupDialog from '@/pages/Transactions/TransactionsDialogs/RequireSetupDialog';
import TransactionOverviewDialog from '@/pages/Transactions/TransactionsDialogs/TransactionOverviewDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface TransactionDialogsProps {
  isCreateDialogOpen: boolean;
  closeCreateDialog: () => void;
}

const TransactionDialogs = ({ isCreateDialogOpen, closeCreateDialog }: TransactionDialogsProps) => {
  const { t } = useTranslation('transactions');
  const { selectedTransaction, setSelectedTransaction, transactionAction, setTransactionAction } =
    useTransactionPageData();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { alertSuccess, alertError } = useSnackbar();

  const hasSelectedTransaction = !!selectedTransaction;
  const isEditOpen = hasSelectedTransaction && transactionAction === 'edit';
  const isDeleteOpen = hasSelectedTransaction && transactionAction === 'delete';
  const isRecurringTransaction = !!selectedTransaction?.templateId;
  const isSingleDeleteOpen = isDeleteOpen && !isRecurringTransaction;
  const isRecurringDeleteOpen = isDeleteOpen && isRecurringTransaction;
  const isOverviewOpen = hasSelectedTransaction && !transactionAction;
  const needsSetup = !accounts?.length || !categories?.length;

  const resetSelectedTransaction = () => {
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
      onError: () => {
        alertError(t('messages.deleteError'));
      },
    },
  });

  const deactivateFrom = useApiMutation<void, { fromDate: string }>({
    method: 'post',
    buildUrl: () =>
      API_ROUTES.RECURRING_TEMPLATES_DEACTIVATE_FROM(selectedTransaction?.templateId ?? ''),
    queryKeysToInvalidate: [queryKeys.transactions()],
    options: {
      onSuccess: () => {
        alertSuccess(t('messages.deleteSuccess'));
      },
      onError: () => {
        alertError(t('messages.deleteError'));
      },
    },
  });

  if (needsSetup) {
    return (
      <RequireSetupDialog
        isCreateDialogOpen={isCreateDialogOpen}
        closeCreateDialog={closeCreateDialog}
      />
    );
  }

  return (
    <>
      {isCreateDialogOpen && (
        <CreateTransactionDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
      {isEditOpen && selectedTransaction && (
        <EditTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={resetSelectedTransaction}
          transaction={selectedTransaction}
        />
      )}
      {isSingleDeleteOpen && selectedTransaction && (
        <DeleteTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={resetSelectedTransaction}
          confirmDeletion={() => {
            deleteTransaction.mutate({
              id: selectedTransaction.originalId ?? selectedTransaction._id,
            });
          }}
        />
      )}
      {isRecurringDeleteOpen && selectedTransaction && (
        <DeleteRecurringTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={resetSelectedTransaction}
          deleteSingleOccurrence={() => {
            deleteTransaction.mutate({
              id: selectedTransaction.originalId ?? selectedTransaction._id,
            });
          }}
          deleteThisAndFutureOccurrences={() => {
            if (selectedTransaction.date) {
              deactivateFrom.mutate({ fromDate: selectedTransaction.date });
            }
          }}
        />
      )}
      {isOverviewOpen && selectedTransaction && (
        <TransactionOverviewDialog
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(undefined)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionDialogs;
