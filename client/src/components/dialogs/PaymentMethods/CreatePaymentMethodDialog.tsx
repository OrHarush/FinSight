import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { PaymentMethodDto, PaymentMethodFormValues } from '@/types/PaymentMethod';
import { CreatePaymentMethodCommand } from '../../../../../shared/types/PaymentMethodCommands';
import PaymentMethodForm from '@/components/dialogs/PaymentMethods/PaymentMethodForm';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';

const CreatePaymentMethodDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('paymentMethods');
  const { alertSuccess, alertError } = useSnackbar();
  const { paymentMethods } = usePaymentMethods();
  const methods = useForm<PaymentMethodFormValues>({
    mode: 'all',
    defaultValues: { isPrimary: paymentMethods.length === 0 },
  });

  const createPaymentMethod = useApiMutation<PaymentMethodDto, CreatePaymentMethodCommand>({
    method: 'post',
    url: API_ROUTES.PAYMENT_METHODS,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
  });

  const createNewPaymentMethod = async (data: PaymentMethodFormValues) => {
    try {
      await createPaymentMethod.mutateAsync(data);
      alertSuccess(t('messages.createSuccess'));
    } catch (err) {
      alertError(t('messages.createError'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('actions.create')}
        onSubmit={createNewPaymentMethod}
      >
        <PaymentMethodForm />
      </FormDialog>
    </FormProvider>
  );
};

export default CreatePaymentMethodDialog;
