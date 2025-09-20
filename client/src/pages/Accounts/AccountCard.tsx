import { Card, CardContent, IconButton, Typography, Box } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AccountDto } from '@/types/Account';
import AccountDetails from '@/pages/Accounts/AccountDetails';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';

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
        console.log('✅ AccountCard onSuccess fired');
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
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <AccountBalanceIcon fontSize="medium" />
              </Box>
              <Typography fontWeight={700}>{account.name}</Typography>
            </Row>
            <Row>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => deleteAccount.mutate()} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Row>
          </Row>
          <AccountDetails account={account} />
        </Column>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
