import { useTranslation } from 'react-i18next';

import DeleteWithReassignDialog from '@/components/dialogs/deletion/DeleteWithReassignDialog';
import ActionMenu, { ActionMenuItem } from '@/components/shared/ui/ActionMenu';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useOpen } from '@/hooks/common/useOpen';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { getPaymentMethodDisplayName } from '@/utils/entities/paymentMethod';

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
  const { t: tPM } = useTranslation('paymentMethods');
  const { alertSuccess, alertError } = useSnackbar();
  const { paymentMethods } = usePaymentMethods();
  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useOpen();

  const isOnlyMethod = paymentMethods.length <= 1;

  const replacementOptions = paymentMethods
    .filter(pm => pm._id !== paymentMethod._id)
    .map(pm => ({ id: pm._id, label: getPaymentMethodDisplayName(pm, tPM) }));

  const setPrimaryPaymentMethod = useApiMutation<void, { id: string }>({
    method: 'patch',
    buildUrl: ({ id }) => `${API_ROUTES.PAYMENT_METHODS}/${id}/primary`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
    options: {
      onSuccess: () => alertSuccess(t('messages.setPrimarySuccess')),
      onError: () => alertError(t('messages.setPrimaryError')),
    },
  });

  const deletePaymentMethod = useApiMutation<void, { id: string; replacementId?: string | null }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.PAYMENT_METHODS}/${id}`,
    queryKeysToInvalidate: [queryKeys.paymentMethods()],
    options: {
      onSuccess: () => {
        closeDeleteDialog();
        alertSuccess(t('messages.deleteSuccess'));
      },
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
      onClick: () => openDeleteDialog(),
      color: 'error',
      disabled: isOnlyMethod,
      tooltip: isOnlyMethod ? t('cannotDeleteLast') : undefined,
    },
  ].filter(Boolean) as ActionMenuItem[];

  return (
    <>
      <ActionMenu anchorEl={anchorEl} open={open} onClose={handleMenuClose} items={menuItems} />
      <DeleteWithReassignDialog
        isOpen={isDeleteDialogOpen}
        closeDialog={closeDeleteDialog}
        onConfirm={replacementId =>
          deletePaymentMethod.mutate({ id: paymentMethod._id, replacementId })
        }
        itemName={getPaymentMethodDisplayName(paymentMethod, tPM)}
        itemType="paymentMethod"
        itemId={paymentMethod._id}
        replacementOptions={replacementOptions}
        isLoading={deletePaymentMethod.isPending}
      />
    </>
  );
};

export default PaymentMethodCardMenu;
