import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePaymentMethodDTO, CreatePaymentMethodSchema } from '@lyra/shared';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormDialog from '@/components/dialogs/FormDialog';
import { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import PaymentMethodForm from '@/pages/PaymentMethods/components/PaymentMethodForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { PaymentMethodDto } from '@/types/PaymentMethod';

const CreatePaymentMethodDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('paymentMethods');
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<CreatePaymentMethodDTO>({
    resolver: zodResolver(CreatePaymentMethodSchema),
    mode: 'all',
  });

  const createPaymentMethod = useApiMutation<PaymentMethodDto, CreatePaymentMethodDTO>({
    method: 'post',
    url: API_ROUTES.PAYMENT_METHODS,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
  });

  const createNewPaymentMethod = async (data: CreatePaymentMethodDTO) => {
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
