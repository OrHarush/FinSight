import { Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';
import AccountDetails from '@/pages/Accounts/AccountCard/AccountDetails';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import EditAndDeleteButtons from '@/components/common/EditAndDeleteButtons';
import { AccountDto } from '@/types/Account';
import AccountIcon from '@/components/accounts/AccountIcon';
import { useOpen } from '@/hooks/useOpen';
import { useState } from 'react';
import TransferDialog from '@/components/dialogs/TransferDialog';

interface AccountCardProps {
  account: AccountDto;
  selectAccount: (account: AccountDto) => void;
}

const AccountCard = ({ account, selectAccount }: AccountCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const [isTransferDialogOpen, openTransferDialog, closeTransferDialog] = useOpen(false);
  const [linkedCount, setLinkedCount] = useState<number>(0);

  const deleteAccount = useApiMutation<void, void>({
    method: 'delete',
    url: `${API_ROUTES.ACCOUNTS}/${account._id}`,
    queryKeysToInvalidate: [queryKeys.accounts()],
    options: {
      onSuccess: () => {
        alertSuccess('Account deleted');
      },
      onError: err => {
        alertError('Failed to delete account');
        console.error('❌ Failed to delete account', err);
      },
    },
  });

  const handleDeleteRequest = async () => {
    try {
      const res = await fetch(`${API_ROUTES.ACCOUNTS}/${account._id}/linked-transactions`);
      const data = await res.json();

      if (data.success && data.count > 0) {
        setLinkedCount(data.count);
        openTransferDialog();
      } else {
        deleteAccount.mutate();
      }
    } catch (err) {
      console.error('Error checking linked transactions', err);
      deleteAccount.mutate();
    }
  };

  return (
    <>
      <Card
        onClick={() => selectAccount(account)}
        sx={{
          minWidth: '300px',
          width: '100%',
          height: '240px',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          border: account.isPrimary ? '2px solid' : '1px solid',
          borderColor: account.isPrimary ? 'primary.main' : 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
            transform: 'translateY(-2px)',
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Column spacing={2}>
            <Row justifyContent="space-between" alignItems="center">
              <Row alignItems="center" spacing={2}>
                <AccountIcon icon={account.icon} />
                <Column>
                  <Typography fontWeight={700}>{account.name}</Typography>
                  {account.isPrimary && (
                    <Typography variant={'body2'} color={'primary'}>
                      Primary
                    </Typography>
                  )}
                </Column>
              </Row>
              <EditAndDeleteButtons
                entityType="account"
                entityName={account.name}
                onEdit={() => selectAccount(account)}
                onConfirmDelete={handleDeleteRequest}
                disabledReason={
                  account.isPrimary ? 'Primary accounts cannot be deleted.' : undefined
                }
              />
            </Row>
            <AccountDetails account={account} />
          </Column>
        </CardContent>
      </Card>
      {isTransferDialogOpen && (
        <TransferDialog
          open={true}
          onClose={closeTransferDialog}
          entityType="account"
          count={linkedCount}
          accountId={account._id}
        />
      )}
    </>
  );
};

export default AccountCard;
