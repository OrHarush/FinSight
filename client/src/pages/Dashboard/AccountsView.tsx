import Row from '@/components/Layout/Row';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { APP_ROUTES } from '@/constants/APP_ROUTES';
import Column from '@/components/Layout/Column';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '@/providers/AccountsProvider';

const AccountsView = () => {
  const navigate = useNavigate();
  const { accounts, isLoading, error } = useAccounts();

  return (
    <Card sx={{ width: '600px', maxHeight: '300px' }}>
      <CardContent sx={{ padding: 4, height: '100%' }}>
        <Column justifyContent="space-between" height="100%">
          <Column spacing={1}>
            <Typography variant="h6">Accounts</Typography>

            {isLoading && <Typography>Loading accounts…</Typography>}
            {error && <Typography color="error">Failed to load accounts</Typography>}

            {!isLoading &&
              accounts?.map(account => (
                <Paper key={account._id} elevation={1} sx={{ padding: 2, borderRadius: '12px' }}>
                  <Row justifyContent="space-between" alignItems="center">
                    <Row spacing={1} alignItems="center">
                      <AccountBalanceIcon />
                      <Typography>{account.name}</Typography>
                    </Row>
                    <Typography fontWeight={600}>{account.balance}₪</Typography>
                  </Row>
                </Paper>
              ))}
          </Column>

          <Button
            variant="outlined"
            sx={{ borderRadius: '12px' }}
            onClick={() => navigate(APP_ROUTES.ACCOUNTS_URL)}
          >
            Manage Accounts
          </Button>
        </Column>
      </CardContent>
    </Card>
  );
};

export default AccountsView;
