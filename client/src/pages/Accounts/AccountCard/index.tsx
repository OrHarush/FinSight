import { Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import Column from '@/components/Layout/Containers/Column';
import AccountDetails from '@/pages/Accounts/AccountCard/AccountDetails';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import EditAndDeleteButtons from '@/components/EditAndDeleteButtons';
import { AccountDto } from '@/types/Account';
import AccountIcon from '@/components/Accounts/AccountIcon';

interface AccountCardProps {
  account: AccountDto;
  selectAccount: (account: AccountDto) => void;
}

const AccountCard = ({ account, selectAccount }: AccountCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();

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

  return (
    <Card
      sx={{
        minWidth: '300px',
        width: '100%',
        height: '240px',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        border: account.isPrimary ? '2px solid' : '1px solid',
        borderColor: account.isPrimary ? 'primary.main' : 'divider',
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
              onDelete={() => deleteAccount.mutate()}
              onEdit={() => selectAccount(account)}
            />
          </Row>
          <AccountDetails account={account} />
        </Column>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
