import FormDialog from '@/components/dialogs/FormDialog';
import { FormProvider, useForm } from 'react-hook-form';
import { TransactionDto, TransactionFormValues } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { mapTransactionFormValuesToPayload } from '@/utils/transactionUtils';
import { CreateTransactionCommand } from '../../../../../shared/types/TransactionCommmands';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import TransactionForm from '@/pages/Transactions/components/TransactionForm';

interface CreateTransactionDialogProps extends BaseDialogProps {
  initialType?: TransactionFormValues['type'];
}

const getDefaultValues = (
  initialType: TransactionFormValues['type'],
  accountId?: string,
  paymentMethodId?: string
): Partial<TransactionFormValues> => {
  const todayLocal = new Date();
  todayLocal.setMinutes(todayLocal.getMinutes() - todayLocal.getTimezoneOffset());

  return {
    date: todayLocal.toISOString().split('T')[0],
    recurrence: 'None',
    type: initialType,
    account: accountId || '',
    paymentMethod: paymentMethodId || '',
  };
};

const CreateTransactionDialog = ({
  isOpen,
  closeDialog,
  initialType = 'Expense',
}: CreateTransactionDialogProps) => {
  const { t } = useTranslation('transactions');
  const { alertSuccess, alertError } = useSnackbar();
  const { primaryAccount } = useAccounts();
  const { primaryPaymentMethod } = usePaymentMethods();

  const methods = useForm<TransactionFormValues>({
    defaultValues: getDefaultValues(initialType, primaryAccount?._id, primaryPaymentMethod?._id),
    mode: 'all',
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
      closeDialog();
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
        title={t('actions.create')}
        onSubmit={submitNewTransaction}
        maxWidth={'xs'}
      >
        <TransactionForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateTransactionDialog;
