import Row from '@/components/Layout/Row';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ROUTES } from '@/constants/routes';
import Column from '@/components/Layout/Column';
import { useNavigate } from 'react-router-dom';

const accounts = [
  {
    name: 'John Doe',
    balance: 100,
  },
];

const AccountsView = () => {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: '600px', maxHeight: '300px' }}>
      <CardContent sx={{ padding: 4, height: '100%' }}>
        <Column justifyContent={'space-between'} height={'100%'}>
          <Column spacing={1}>
            <Typography>Accounts</Typography>
            {accounts.map(account => (
              <Paper key={account.name} elevation={1} sx={{ padding: 2, borderRadius: '12px' }}>
                <Row justifyContent={'space-between'}>
                  <Row spacing={1}>
                    <AccountBalanceIcon />
                    <Typography>{account.name}</Typography>
                  </Row>
                  <Typography>{account.balance}</Typography>
                </Row>
              </Paper>
            ))}
          </Column>
          <Button
            variant={'outlined'}
            sx={{ borderRadius: '12px' }}
            onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
          >
            Manage Accounts
          </Button>
        </Column>
      </CardContent>
    </Card>
  );
};

export default AccountsView;
