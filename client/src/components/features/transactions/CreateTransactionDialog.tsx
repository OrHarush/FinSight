import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateRecurringTemplateDTO,
  CreateTransactionDTO,
  TransactionFormSchema,
  TransactionFormValues,
} from '@lyra/shared';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useApiMutation } from '@/hooks/useApiMutation';
import TransactionForm from '@/pages/Transactions/components/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { TransactionDto } from '@/types/Transaction';
import { mapToCreatePayload, mapToRecurringTemplatePayload } from '@/utils/entities/transaction';

interface CreateTransactionDialogProps extends BaseDialogProps {
  initialType?: TransactionFormValues['type'];
  initialAccountId?: string;
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
  initialAccountId,
}: CreateTransactionDialogProps) => {
  const { t } = useTranslation('transactions');
  const { alertSuccess, alertError } = useSnackbar();
  const { primaryAccount } = useAccounts();
  const { primaryPaymentMethod } = usePaymentMethods();

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: getDefaultValues(
      initialType,
      initialAccountId ?? primaryAccount?._id,
      primaryPaymentMethod?._id
    ),
    mode: 'all',
  });

  const createTransaction = useApiMutation<TransactionDto, CreateTransactionDTO>({
    method: 'post',
    url: API_ROUTES.TRANSACTIONS,
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const createRecurringTemplate = useApiMutation<unknown, CreateRecurringTemplateDTO>({
    method: 'post',
    url: API_ROUTES.RECURRING_TEMPLATES_WITH_TRANSACTIONS,
    queryKeysToInvalidate: [queryKeys.allTransactions()],
  });

  const createNewTransaction = async (data: TransactionFormValues) => {
    const isRecurring = data.recurrence !== 'None';

    try {
      if (isRecurring) {
        await createRecurringTemplate.mutateAsync(mapToRecurringTemplatePayload(data));
      } else {
        await createTransaction.mutateAsync(mapToCreatePayload(data));
      }

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
        onSubmit={createNewTransaction}
        maxWidth={'xs'}
      >
        <TransactionForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateTransactionDialog;
