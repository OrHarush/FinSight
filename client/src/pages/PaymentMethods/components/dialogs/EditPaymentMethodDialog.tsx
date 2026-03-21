import { UpdatePaymentMethodDTO, UpdatePaymentMethodSchema } from '@finsight/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FormDialog from '@/components/dialogs/FormDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import PaymentMethodForm from '@/pages/PaymentMethods/components/PaymentMethodForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { PaymentMethodDto } from '@/types/PaymentMethod';

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

  const methods = useForm<UpdatePaymentMethodDTO>({
    resolver: zodResolver(UpdatePaymentMethodSchema),
    defaultValues: {
      name: paymentMethod.name,
      billingDay: paymentMethod.billingDay,
      type: paymentMethod.type,
      lastFourDigits: paymentMethod.lastFourDigits,
      isPrimary: paymentMethod.isPrimary,
    },
    mode: 'all',
  });

  const updatePaymentMethod = useApiMutation<PaymentMethodDto, UpdatePaymentMethodDTO>({
    method: 'put',
    url: `${API_ROUTES.PAYMENT_METHODS}/${paymentMethod._id}`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
  });

  const update = async (data: UpdatePaymentMethodDTO) => {
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
