import { useTranslation } from 'react-i18next';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import ActionMenu, { ActionMenuItem } from '@/components/shared/ui/ActionMenu';

interface PaymentMethodCardMenuProps {
  paymentMethod: PaymentMethodDto;
  open: boolean;
  handleMenuClose: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
}

const PaymentMethodCardMenu = ({
  paymentMethod,
  open,
  handleMenuClose,
  anchorEl,
}: PaymentMethodCardMenuProps) => {
  const { t } = useTranslation(['paymentMethods', 'common']);
  const { alertSuccess, alertError } = useSnackbar();

  const setPrimaryPaymentMethod = useApiMutation<void, { id: string }>({
    method: 'post',
    buildUrl: ({ id }) => `${API_ROUTES.PAYMENT_METHODS}/${id}/set-primary`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
    options: {
      onSuccess: () => alertSuccess(t('messages.setPrimarySuccess')),
      onError: () => alertError(t('messages.setPrimaryError')),
    },
  });

  const deletePaymentMethod = useApiMutation<void, { id: string }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.PAYMENT_METHODS}/${id}`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
    options: {
      onSuccess: () => alertSuccess(t('messages.deleteSuccess')),
      onError: () => alertError(t('messages.deleteError')),
    },
  });

  const menuItems: ActionMenuItem[] = [
    !paymentMethod.isPrimary && {
      label: t('common:actions.setPrimary'),
      onClick: () => setPrimaryPaymentMethod.mutate({ id: paymentMethod._id }),
    },
    {
      label: t('actions.delete'),
      onClick: () => deletePaymentMethod.mutate({ id: paymentMethod._id }),
      color: 'error',
    },
  ].filter(Boolean) as ActionMenuItem[];

  return <ActionMenu anchorEl={anchorEl} open={open} onClose={handleMenuClose} items={menuItems} />;
};

export default PaymentMethodCardMenu;
