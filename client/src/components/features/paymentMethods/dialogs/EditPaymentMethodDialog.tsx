import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { PaymentMethodDto, PaymentMethodFormValues } from '@/types/PaymentMethod';
import { UpdatePaymentMethodCommand } from '../../../../../../shared/types/PaymentMethodCommands';
import PaymentMethodForm from '@/components/features/paymentMethods/PaymentMethodForm';

interface EditPaymentMethodDialogProps extends BaseDialogProps {
  paymentMethod: PaymentMethodDto;
}

const EditPaymentMethodDialog = ({
  isOpen,
  closeDialog,
  paymentMethod,
}: EditPaymentMethodDialogProps) => {
  const { t } = useTranslation('paymentMethods');
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<PaymentMethodFormValues>({
    defaultValues: {
      name: paymentMethod.name,
      billingDay: paymentMethod.billingDay,
      type: paymentMethod.type,
      last4: paymentMethod.last4,
      isPrimary: paymentMethod.isPrimary,
    },
    mode: 'all',
  });

  const updatePaymentMethod = useApiMutation<PaymentMethodDto, UpdatePaymentMethodCommand>({
    method: 'put',
    url: `${API_ROUTES.PAYMENT_METHODS}/${paymentMethod._id}`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
  });

  const update = async (data: PaymentMethodFormValues) => {
    try {
      await updatePaymentMethod.mutateAsync(data);
      alertSuccess(t('messages.updateSuccess'));
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
      >
        <PaymentMethodForm />
      </FormDialog>
    </FormProvider>
  );
};

export default EditPaymentMethodDialog;
