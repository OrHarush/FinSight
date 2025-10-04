import FormDialog, { DialogProps } from '@/components/Dialogs/FormDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { TransactionDto, TransactionFormValues } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import TransactionForm from '@/components/Dialogs/TransactionDialogs/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { mapTransactionFormValuesToPayload } from '@/utils/transactionUtils';
import { CreateTransactionCommand } from '../../../../../shared/types/TransactionCommands';

const CreateTransactionDialog = ({ isOpen, closeDialog }: DialogProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<TransactionFormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      recurrence: 'None',
      type: 'Expense',
      category: '',
      account: '',
    },
  });

  const createTransaction = useApiMutation<TransactionDto, CreateTransactionCommand>({
    method: 'post',
    url: API_ROUTES.TRANSACTIONS,
    queryKeysToInvalidate: [queryKeys.transactions()],
  });

  const submitNewTransaction = async (data: TransactionFormValues) => {
    try {
      await createTransaction.mutateAsync(mapTransactionFormValuesToPayload(data));
      alertSuccess('Transaction created!');
    } catch (err) {
      alertError('Failed to create transaction.');
      console.error('❌ Failed to create transaction:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={'Create Transaction'}
        onSubmit={submitNewTransaction}
      >
        <TransactionForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateTransactionDialog;
