import FormDialog from '@/components/dialogs/FormDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { TransactionDto, TransactionFormValues } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import TransactionForm from '@/components/dialogs/TransactionDialogs/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { mapTransactionFormValuesToPayload } from '@/utils/transactionUtils';
import { CreateTransactionCommand } from '../../../../../shared/types/TransactionCommands';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/hooks/entities/useAccounts';

const CreateTransactionDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('transactions');
  const { alertSuccess, alertError } = useSnackbar();

  const { primaryAccount } = useAccounts();

  const methods = useForm<TransactionFormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      recurrence: 'None',
      type: 'Expense',
      category: '',
      account: primaryAccount?._id || '',
      fromAccount: '',
      toAccount: '',
    },
  });

  const createTransaction = useApiMutation<TransactionDto, CreateTransactionCommand>({
    method: 'post',
    url: API_ROUTES.TRANSACTIONS,
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const submitNewTransaction = async (data: TransactionFormValues) => {
    try {
      await createTransaction.mutateAsync(mapTransactionFormValuesToPayload(data));
      alertSuccess(t('messages.createSuccess'));
    } catch (err) {
      alertError(t('messages.createError'));
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
