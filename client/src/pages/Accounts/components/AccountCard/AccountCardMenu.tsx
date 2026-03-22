import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteWithReassignDialog from '@/components/dialogs/deletion/DeleteWithReassignDialog';
import ActionMenu, { ActionMenuItem } from '@/components/shared/ui/ActionMenu';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AccountDto } from '@/types/Account';

interface AccountCardMenuProps {
  account: AccountDto;
  open: boolean;
  handleMenuClose: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
}

const AccountCardMenu = ({ account, open, handleMenuClose, anchorEl }: AccountCardMenuProps) => {
  const { t } = useTranslation(['accounts', 'common']);
  const { alertSuccess, alertError } = useSnackbar();
  const { accounts } = useAccounts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOnlyAccount = accounts.length <= 1;

  const replacementOptions = accounts
    .filter(a => a._id !== account._id)
    .map(a => ({ id: a._id, label: a.name }));

  const setPrimaryAccount = useApiMutation<void, { id: string }>({
    method: 'patch',
    buildUrl: ({ id }) => `${API_ROUTES.ACCOUNTS}/${id}/primary`,
    queryKeysToInvalidate: [queryKeys.accounts()],
    options: {
      onSuccess: () => alertSuccess(t('messages.setPrimarySuccess')),
      onError: () => alertError(t('messages.setPrimaryError')),
    },
  });

  const syncBalance = useApiMutation<{ balance: number; syncedAt: string }, void>({
    method: 'post',
    url: API_ROUTES.ACCOUNT_SYNC_BALANCE(account._id),
    queryKeysToInvalidate: [queryKeys.account(account._id), queryKeys.accounts()],
  });

  const deleteAccount = useApiMutation<void, { id: string; replacementId?: string | null }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.ACCOUNTS}/${id}`,
    queryKeysToInvalidate: [queryKeys.accounts()],
    options: {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        alertSuccess(t('messages.deleteSuccess'));
      },
      onError: () => alertError(t('messages.deleteError')),
    },
  });

  const menuItems: ActionMenuItem[] = [
    !account.isPrimary && {
      label: t('common:actions.setPrimary'),
      onClick: () => setPrimaryAccount.mutate({ id: account._id }),
    },
    {
      label: t('actions.recalculateBalance'),
      onClick: () => syncBalance.mutate(),
    },
    {
      label: t('actions.delete'),
      onClick: () => setDeleteDialogOpen(true),
      color: 'error',
      disabled: isOnlyAccount,
      tooltip: isOnlyAccount ? t('cannotDeleteLast') : undefined,
    },
  ].filter(Boolean) as ActionMenuItem[];

  return (
    <>
      <ActionMenu anchorEl={anchorEl} open={open} onClose={handleMenuClose} items={menuItems} />
      <DeleteWithReassignDialog
        isOpen={deleteDialogOpen}
        closeDialog={() => setDeleteDialogOpen(false)}
        onConfirm={replacementId => deleteAccount.mutate({ id: account._id, replacementId })}
        itemName={account.name}
        itemType="account"
        itemId={account._id}
        replacementOptions={replacementOptions}
        isLoading={deleteAccount.isPending}
      />
    </>
  );
};

export default AccountCardMenu;
