import {
  SplitRecurringTemplateDTO,
  TransactionFormSchema,
  TransactionFormValues,
  UpdateTransactionDTO,
} from '@finsight/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import RecurringEditChoiceDialog from '@/pages/Transactions/components/RecurringEditChoiceDialog';
import TransactionForm from '@/pages/Transactions/components/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ExpandedTransactionDto, TransactionDto } from '@/types/Transaction';
import { mapToTemplateChangesPayload, mapToUpdatePayload } from '@/utils/entities/transaction';

interface EditTransactionDialogProps extends BaseDialogProps {
  transaction: ExpandedTransactionDto;
}

const EditTransactionDialog = ({
  transaction,
  isOpen,
  closeDialog,
}: EditTransactionDialogProps) => {
  const { t } = useTranslation('transactions');
  const { alertSuccess, alertError } = useSnackbar();
  const [pendingData, setPendingData] = useState<TransactionFormValues | null>(null);

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date ? transaction.date.split('T')[0] : undefined,
      belongToPreviousMonth: transaction.belongToPreviousMonth,
      type: transaction.type,
      paymentMethod: transaction?.paymentMethod?._id,
      category: transaction?.category?._id,
      account: transaction?.account?._id,
    },
    mode: 'all',
  });

  const updateTransaction = useApiMutation<TransactionDto, UpdateTransactionDTO>({
    method: 'put',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction?.originalId ?? transaction._id}`,
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const splitTemplate = useApiMutation<unknown, SplitRecurringTemplateDTO>({
    method: 'put',
    url: API_ROUTES.RECURRING_TEMPLATES_SPLIT(transaction.templateId ?? ''),
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const submitEdit = async (data: TransactionFormValues) => {
    if (transaction.templateId) {
      setPendingData(data);
      return;
    }

    await performThisOnly(data);
  };

  const performThisOnly = async (data: TransactionFormValues) => {
    try {
      await updateTransaction.mutateAsync(mapToUpdatePayload(data));
      alertSuccess(t('messages.updateSuccess'));
      closeDialog();
    } catch (err) {
      alertError(t('messages.updateError'));
      console.error(err);
    }
  };

  const performThisAndFuture = async (data: TransactionFormValues) => {
    if (!transaction.templateId || !transaction.date) {
      return;
    }

    try {
      await splitTemplate.mutateAsync(
        mapToTemplateChangesPayload(data, transaction.date),
      );
      alertSuccess(t('messages.updateSuccess'));
      closeDialog();
    } catch (err) {
      alertError(t('messages.updateError'));
      console.error(err);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <FormDialog
          isOpen={isOpen}
          closeDialog={closeDialog}
          title={t('actions.edit')}
          onSubmit={submitEdit}
          isUpdateForm
          maxWidth={'xs'}
        >
          <TransactionForm disableTypeSelector />
        </FormDialog>
      </FormProvider>

      {pendingData && (
        <RecurringEditChoiceDialog
          isOpen={pendingData !== null}
          closeDialog={() => setPendingData(null)}
          onThisOnly={() => performThisOnly(pendingData)}
          onThisAndFuture={() => performThisAndFuture(pendingData)}
        />
      )}
    </>
  );
};

export default EditTransactionDialog;
