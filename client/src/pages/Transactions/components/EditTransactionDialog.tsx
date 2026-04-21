import { zodResolver } from '@hookform/resolvers/zod';
import {
  SplitRecurringTemplateDTO,
  TransactionFormSchema,
  TransactionFormValues,
  UpdateTransactionDTO,
} from '@lyra/shared';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import { queryKeys } from '@/constants/queryKeys';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import EditRecurringTransactionDialog from '@/pages/Transactions/components/EditRecurringTransactionDialog';
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
  const { t: tCommon } = useTranslation('common');
  const { alertSuccess, alertError } = useSnackbar();
  const [pendingData, setPendingData] = useState<TransactionFormValues | null>(null);
  const isSmallScreen = useIsSmallScreen();

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date ? transaction.date.split('T')[0] : undefined,
      recurrence: 'None',
      belongToPreviousMonth: transaction.belongToPreviousMonth,
      type: transaction.type,
      paymentMethod: transaction?.paymentMethod?._id,
      category: transaction?.category?._id ?? '',
      account: transaction?.account?._id,
      note: transaction.note,
    },
    mode: 'all',
  });

  const updateTransaction = useApiMutation<TransactionDto, UpdateTransactionDTO>({
    method: 'put',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction?.originalId ?? transaction._id}`,
    queryKeysToInvalidate: [
      queryKeys.allTransactions(),
      ['transactionSummary'],
      queryKeys.quickChips(),
    ],
  });

  const splitTemplate = useApiMutation<unknown, SplitRecurringTemplateDTO>({
    method: 'put',
    url: API_ROUTES.RECURRING_TEMPLATES_SPLIT(transaction.templateId ?? ''),
    queryKeysToInvalidate: [
      queryKeys.allTransactions(),
      ['transactionSummary'],
      queryKeys.quickChips(),
    ],
  });

  const submitEdit = async (data: TransactionFormValues) => {
    if (transaction.templateId) {
      setPendingData(data);
      return;
    }

    await editSingleOccurrence(data);
  };

  const editSingleOccurrence = async (data: TransactionFormValues) => {
    try {
      await updateTransaction.mutateAsync(mapToUpdatePayload(data));
      alertSuccess(t('messages.updateSuccess'));
      methods.reset();
      closeDialog();
    } catch (err) {
      alertError(t('messages.updateError'));
    }
  };

  const editThisAndFutureOccurrences = async (data: TransactionFormValues) => {
    if (!transaction.templateId || !transaction.date) {
      return;
    }

    try {
      await splitTemplate.mutateAsync(mapToTemplateChangesPayload(data, transaction.date));
      alertSuccess(t('messages.updateSuccess'));
      methods.reset();
      closeDialog();
    } catch (err) {
      alertError(t('messages.updateError'));
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <LyraDialog
          isOpen={isOpen}
          closeDialog={() => {
            methods.reset();
            closeDialog();
          }}
          title={t('actions.edit')}
          maxWidth={isSmallScreen ? 'xs' : 'sm'}
        >
          <form onSubmit={methods.handleSubmit(submitEdit)} noValidate>
            <DialogContent sx={{ pt: 1 }}>
              <Column spacing={2}>
                <TransactionForm disableTypeSelector hideRecurrence />
              </Column>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} variant="outlined">
                {tCommon('buttons.cancel')}
              </Button>
              <Button type="submit" variant="contained">
                {tCommon('buttons.update')}
              </Button>
            </DialogActions>
          </form>
        </LyraDialog>
      </FormProvider>
      {pendingData && (
        <EditRecurringTransactionDialog
          isOpen={pendingData !== null}
          closeDialog={() => setPendingData(null)}
          editSingleOccurrence={() => editSingleOccurrence(pendingData)}
          editThisAndFutureOccurrences={() => editThisAndFutureOccurrences(pendingData)}
        />
      )}
    </>
  );
};

export default EditTransactionDialog;
