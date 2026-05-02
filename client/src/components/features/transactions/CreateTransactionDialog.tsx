import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateRecurringTemplateDTO,
  CreateTransactionDTO,
  TransactionFormSchema,
  TransactionFormValues,
} from '@lyra/shared';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useApiMutation } from '@/hooks/useApiMutation';
import TransactionForm from '@/pages/Transactions/components/TransactionForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { TransactionMutationResult } from '@/types/Transaction';
import { mapToCreatePayload, mapToRecurringTemplatePayload } from '@/utils/entities/transaction';

interface CreateTransactionDialogProps extends BaseDialogProps {
  initialType?: TransactionFormValues['type'];
  initialAccountId?: string;
  initialValues?: Partial<TransactionFormValues>;
}

const getDefaultValues = (
  initialType: TransactionFormValues['type'],
  accountId?: string,
  paymentMethodId?: string,
  initialValues?: Partial<TransactionFormValues>
): Partial<TransactionFormValues> => {
  const todayLocal = new Date();
  todayLocal.setMinutes(todayLocal.getMinutes() - todayLocal.getTimezoneOffset());

  return {
    date: todayLocal.toISOString().split('T')[0],
    recurrence: 'None',
    type: initialType,
    category: '',
    account: accountId || '',
    paymentMethod: paymentMethodId || '',
    ...initialValues,
  };
};

const CreateTransactionDialog = ({
  isOpen,
  closeDialog,
  initialType = 'Expense',
  initialAccountId,
  initialValues,
}: CreateTransactionDialogProps) => {
  const { t, i18n } = useTranslation('transactions');
  const { alertSuccess, alertError } = useSnackbar();
  const { primaryAccount } = useAccounts();
  const { paymentMethods, primaryPaymentMethod } = usePaymentMethods();
  const isSmallScreen = useIsSmallScreen();
  const queryClient = useQueryClient();

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: getDefaultValues(
      initialValues?.type ?? initialType,
      initialAccountId ?? primaryAccount?._id,
      primaryPaymentMethod?._id,
      initialValues
    ),
    mode: 'all',
  });

  const createTransaction = useApiMutation<
    ApiResponse<TransactionMutationResult>,
    CreateTransactionDTO
  >({
    method: 'post',
    url: API_ROUTES.TRANSACTIONS,
    queryKeysToInvalidate: [
      queryKeys.allTransactions(),
      ['transactionSummary'],
      queryKeys.quickChips(),
      queryKeys.categories(),
    ],
    options: {
      onSuccess: response => {
        queryClient.setQueryData(queryKeys.accounts(), {
          success: true,
          data: response.data.accounts,
        });
      },
    },
  });

  const createRecurringTemplate = useApiMutation<unknown, CreateRecurringTemplateDTO>({
    method: 'post',
    url: API_ROUTES.RECURRING_TEMPLATES_WITH_TRANSACTIONS,
    queryKeysToInvalidate: [
      queryKeys.allTransactions(),
      ['transactionSummary'],
      queryKeys.quickChips(),
      queryKeys.categories(),
      queryKeys.accounts(),
    ],
  });

  const createNewTransaction = async (data: TransactionFormValues) => {
    const isRecurring = data.recurrence !== 'None';

    try {
      if (isRecurring) {
        await createRecurringTemplate.mutateAsync(mapToRecurringTemplatePayload(data));
      } else {
        await createTransaction.mutateAsync(mapToCreatePayload(data));
      }

      const selectedPm = paymentMethods.find(pm => pm._id === data.paymentMethod);

      const billingDay = selectedPm?.type === 'Credit Card' ? selectedPm.billingDay : undefined;
      const parsedDate = data.date && dayjs(data.date).isValid() ? dayjs(data.date) : null;
      const isPreviousCycle = !!billingDay && !!parsedDate && parsedDate.date() < billingDay;

      if (isPreviousCycle) {
        const prevMonth = parsedDate!.subtract(1, 'month').locale(i18n.language).format('MMMM');
        alertSuccess(t('messages.createSuccessBillingCycle', { month: prevMonth }));
      } else {
        alertSuccess(t('messages.createSuccess'));
      }
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
        maxWidth={isSmallScreen ? 'xs' : 'sm'}
      >
        <TransactionForm showQuickChips />
      </FormDialog>
    </FormProvider>
  );
};

export default CreateTransactionDialog;
