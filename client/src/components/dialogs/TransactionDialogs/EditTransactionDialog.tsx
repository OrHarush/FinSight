import { FormProvider, useForm } from 'react-hook-form';
import FormDialog from '@/components/dialogs/FormDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ExpandedTransactionDto, TransactionDto, TransactionFormValues } from '@/types/Transaction';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { UpdateTransactionCommand } from '../../../../../shared/types/TransactionCommmands';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import TransactionForm from '@/components/dialogs/TransactionDialogs/TransactionForm';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();

  const methods = useForm<TransactionFormValues>({
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

  const updateTransaction = useApiMutation<TransactionDto, UpdateTransactionCommand>({
    method: 'put',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction?.originalId ?? transaction._id}`,
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const update = async (data: TransactionFormValues) => {
    try {
      await updateTransaction.mutateAsync({ ...data });
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
        maxWidth={isMobile ? 'xs' : 'md'}
      >
        <TransactionForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditTransactionDialog;
