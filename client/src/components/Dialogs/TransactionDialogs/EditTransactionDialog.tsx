import { FormProvider, useForm } from 'react-hook-form';
import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import TransactionForm from '@/components/Dialogs/TransactionDialogs/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CategoryDto, CategoryFormValues } from '@/types/CategoryDto';
import { ExtendedTransaction, TransactionFormValues } from '@/types/Transaction';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';

interface EditTransactionDialogProps extends DialogProps {
  transaction: ExtendedTransaction;
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
      date: transaction.date.split('T')[0],
      endDate: transaction.endDate ? transaction.endDate.split('T')[0] : undefined,
      recurrence: transaction.recurrence,
      category: transaction.category._id,
      account: transaction.account._id,
    },
  });

  const updateCategory = useApiMutation<CategoryDto, CategoryFormValues>({
    method: 'put',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction.originalId}`,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const update = async (data: CategoryFormValues) => {
    try {
      await updateCategory.mutateAsync(data);
      alertSuccess('Category updated!');
      closeDialog();
    } catch (err) {
      alertError('Failed to update category.');
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Create Transaction'}
        onSubmit={update}
      >
        <TransactionForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditTransactionDialog;
