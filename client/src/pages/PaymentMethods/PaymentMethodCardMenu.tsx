import { Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';

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
  const { t } = useTranslation('paymentMethods');
  const { alertSuccess, alertError } = useSnackbar();

  const setPrimaryPaymentMethod = useApiMutation<void, { id: string }>({
    method: 'post',
    buildUrl: ({ id }) => `${API_ROUTES.PAYMENT_METHODS}/${id}/set-primary`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
    options: {
      onSuccess: () => {
        alertSuccess(t('messages.setPrimarySuccess'));
      },
      onError: () => {
        alertError(t('messages.setPrimaryError'));
      },
    },
  });

  const deletePaymentMethod = useApiMutation<void, { id: string }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.PAYMENT_METHODS}/${id}`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
    options: {
      onSuccess: () => {
        alertSuccess(t('messages.deleteSuccess'));
      },
      onError: err => {
        alertError(t('messages.deleteError'));
        console.error('❌ Failed to delete transaction', err);
      },
    },
  });

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
      {!paymentMethod.isPrimary && (
        <MenuItem
          onClick={e => {
            handleMenuClose(e);
            setPrimaryPaymentMethod.mutate({ id: paymentMethod._id });
          }}
        >
          {t('actions.setPrimary')}
        </MenuItem>
      )}
      <MenuItem
        onClick={e => {
          handleMenuClose(e);
          deletePaymentMethod.mutate({ id: paymentMethod._id });
        }}
        sx={{ color: 'error.main' }}
      >
        {t('actions.delete')}
      </MenuItem>
    </Menu>
  );
};

export default PaymentMethodCardMenu;
