import { useTranslation } from 'react-i18next';
import { AccountDto } from '@/types/Account';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import ActionMenu, { ActionMenuItem } from '@/components/appCommon/ActionMenu';

interface AccountCardMenuProps {
  account: AccountDto;
  open: boolean;
  handleMenuClose: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
}

const AccountCardMenu = ({ account, open, handleMenuClose, anchorEl }: AccountCardMenuProps) => {
  const { t } = useTranslation(['accounts', 'common']);
  const { alertSuccess, alertError } = useSnackbar();

  const setPrimaryAccount = useApiMutation<void, { id: string }>({
    method: 'post',
    buildUrl: ({ id }) => `${API_ROUTES.ACCOUNTS}/${id}/set-primary`,
    queryKeysToInvalidate: [queryKeys.accounts()],
    options: {
      onSuccess: () => alertSuccess(t('messages.setPrimarySuccess')),
      onError: () => alertError(t('messages.setPrimaryError')),
    },
  });

  const deleteAccount = useApiMutation<void, { id: string }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.ACCOUNTS}/${id}`,
    queryKeysToInvalidate: [queryKeys.accounts()],
    options: {
      onSuccess: () => alertSuccess(t('messages.deleteSuccess')),
      onError: () => alertError(t('messages.deleteError')),
    },
  });

  const menuItems: ActionMenuItem[] = [
    !account.isPrimary && {
      label: t('common:actions.setPrimary'),
      onClick: () => setPrimaryAccount.mutate({ id: account._id }),
    },
    {
      label: t('actions.delete'),
      onClick: () => deleteAccount.mutate({ id: account._id }),
      color: 'error',
    },
  ].filter(Boolean) as ActionMenuItem[];

  return <ActionMenu anchorEl={anchorEl} open={open} onClose={handleMenuClose} items={menuItems} />;
};

export default AccountCardMenu;
