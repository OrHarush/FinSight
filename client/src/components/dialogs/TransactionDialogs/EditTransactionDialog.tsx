import { FormProvider, useForm } from 'react-hook-form';
import FormDialog from '@/components/dialogs/FormDialog';
import TransactionForm from '@/components/dialogs/TransactionDialogs/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ExpandedTransactionDto, TransactionDto, TransactionFormValues } from '@/types/Transaction';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { UpdateTransactionCommand } from '../../../../../shared/types/TransactionCommands';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';

interface EditTransactionDialogProps extends BaseDialogProps {
  transaction: ExpandedTransactionDto;
}

const EditTransactionDialog = ({
  transaction,
  isOpen,
  closeDialog,
}: EditTransactionDialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<TransactionFormValues>({
    defaultValues: {
      name: transaction.name,
      amount: transaction.amount,
      date:
        transaction.recurrence === 'Monthly'
          ? transaction.date.slice(0, 7)
          : transaction.date.split('T')[0],
      endDate: transaction.endDate ? transaction.endDate.split('T')[0] : undefined,
      recurrence: transaction.recurrence,
      type: transaction.type,
      category: transaction?.category?._id,
      account: transaction?.account?._id,
    },
  });

  const updateTransaction = useApiMutation<TransactionDto, UpdateTransactionCommand>({
    method: 'put',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction?.originalId ?? transaction._id}`,
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const update = async (data: TransactionFormValues) => {
    try {
      await updateTransaction.mutateAsync({ ...data });
      alertSuccess('Transaction updated!');
      closeDialog();
    } catch (err) {
      alertError('Failed to update transaction');
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Edit Transaction'}
        onSubmit={update}
        isUpdateForm
      >
        <TransactionForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditTransactionDialog;
