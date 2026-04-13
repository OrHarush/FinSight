import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import api from '@/api/axios';
import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import UndoSnackbar from '@/components/shared/ui/UndoSnackbar';
import { API_ROUTES } from '@/constants/Routes';
import { usePendingDelete } from '@/hooks/common/usePendingDelete';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useCategories } from '@/hooks/entities/useCategories';
import EditTransactionDialog from '@/pages/Transactions/components/EditTransactionDialog';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import DeleteRecurringTransactionDialog from '@/pages/Transactions/TransactionsDialogs/DeleteRecurringTransactionDialog';
import RequireSetupDialog from '@/pages/Transactions/TransactionsDialogs/RequireSetupDialog';
import TransactionOverviewDialog from '@/pages/Transactions/TransactionsDialogs/TransactionOverviewDialog';

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
  const { pendingDelete, triggerDelete, undoDelete, onExpire } = usePendingDelete();

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

  const singleDeleteTriggered = useRef(false);

  useEffect(() => {
    if (!isSingleDeleteOpen || !selectedTransaction || singleDeleteTriggered.current) {
      return;
    }

    singleDeleteTriggered.current = true;
    const id = selectedTransaction.originalId ?? selectedTransaction._id;

    triggerDelete(selectedTransaction, async () => {
      await api.delete(`${API_ROUTES.TRANSACTIONS}/${id}`);
    });

    resetSelectedTransaction();
  }, [isSingleDeleteOpen, selectedTransaction]);

  useEffect(() => {
    if (!isSingleDeleteOpen) {
      singleDeleteTriggered.current = false;
    }
  }, [isSingleDeleteOpen]);

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
      {isRecurringDeleteOpen && selectedTransaction && (
        <DeleteRecurringTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={resetSelectedTransaction}
          deleteSingleOccurrence={() => {
            const tx = selectedTransaction;
            const id = tx.originalId ?? tx._id;

            triggerDelete(tx, async () => {
              await api.delete(`${API_ROUTES.TRANSACTIONS}/${id}`);
            });
          }}
          deleteThisAndFutureOccurrences={() => {
            const tx = selectedTransaction;

            if (tx.date && tx.templateId) {
              triggerDelete(tx, async () => {
                await api.post(API_ROUTES.RECURRING_TEMPLATES_DEACTIVATE_FROM(tx.templateId!), {
                  fromDate: tx.date,
                });
              });
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
      <UndoSnackbar
        open={!!pendingDelete}
        message={t('messages.transactionDeleted')}
        undoLabel={t('common:buttons.undo')}
        onUndo={undoDelete}
        onExpire={onExpire}
      />
    </>
  );
};

export default TransactionDialogs;
