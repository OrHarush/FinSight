import { Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import Column from '@/components/Layout/Containers/Column';
import { AccountDto } from '@/types/Account';
import AccountDetails from '@/pages/Accounts/AccountDetails';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import EditAndDeleteButtons from '@/components/EditAndDeleteButtons';
import AccountIcon from '@/components/Accounts/AccountIcon';

interface AccountCardProps {
  account: AccountDto;
}

const AccountCard = ({ account }: AccountCardProps) => {
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
        width: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Column spacing={2}>
          <Row justifyContent="space-between" alignItems="center">
            <Row alignItems="center" spacing={2}>
              <AccountIcon />
              <Typography fontWeight={700}>{account.name}</Typography>
            </Row>
            <EditAndDeleteButtons onDelete={() => deleteAccount.mutate()} onEdit={() => {}} />
          </Row>
          <AccountDetails account={account} />
        </Column>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
