import {
  TransactionFormSchema,
  TransactionFormValues,
  UpdateTransactionDTO,
} from '@finsight/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import TransactionForm from '@/pages/Transactions/components/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ExpandedTransactionDto, TransactionDto } from '@/types/Transaction';
import { mapToUpdatePayload } from '@/utils/transactionUtils';

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

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date ? transaction.date.split('T')[0] : undefined,
      endDate: transaction.endDate ? dayjs(transaction.endDate).format('YYYY-MM') : undefined,
      startDate: transaction.startDate ? transaction.startDate.split('T')[0] : undefined,
      recurrence: transaction.recurrence,
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

  const update = async (data: TransactionFormValues) => {
    try {
      await updateTransaction.mutateAsync(mapToUpdatePayload(data));
      alertSuccess(t('messages.updateSuccess'));
      closeDialog();
    } catch (err) {
      alertError(t('messages.updateError'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('actions.edit')}
        onSubmit={update}
        isUpdateForm
        maxWidth={'xs'}
      >
        <TransactionForm disableTypeSelector />
      </FormDialog>
    </FormProvider>
  );
};

export default EditTransactionDialog;
