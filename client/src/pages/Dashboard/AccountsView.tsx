import Row from '@/components/Layout/Row';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ROUTES } from '@/constants/Routes';
import Column from '@/components/Layout/Column';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '@/providers/AccountsProvider';
import CurrencyText from '@/components/CurrencyText';

const AccountsView = () => {
  const navigate = useNavigate();
  const { accounts, isLoading, error } = useAccounts();

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ maxHeight: '220px' }}>
        <CardContent sx={{ padding: 4, height: '100%' }}>
          <Column justifyContent="space-between" height="100%">
            <Column spacing={1}>
              <Row justifyContent={'space-between'}>
                <Typography variant="h6">Accounts</Typography>
                <Button
                  variant="outlined"
                  sx={{ borderRadius: '12px' }}
                  onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
                >
                  Manage Accounts
                </Button>
              </Row>
              {isLoading && <Typography>Loading accounts…</Typography>}
              {error && <Typography color="error">Failed to load accounts</Typography>}
              <Row spacing={4}>
                {!isLoading &&
                  accounts?.map(account => (
                    <Paper
                      key={account._id}
                      elevation={1}
                      sx={{
                        padding: 2,
                        borderRadius: '12px',
                        width: '180px',
                      }}
                    >
                      <Column spacing={2} alignItems={'center'}>
                        <Row spacing={1} alignItems="center">
                          <AccountBalanceIcon fontSize={'large'} />
                          <Typography>{account.name}</Typography>
                        </Row>
                        <CurrencyText
                          variant={'h5'}
                          fontWeight={600}
                          textAlign={'center'}
                          value={account.balance}
                        />
                      </Column>
                    </Paper>
                  ))}
              </Row>
            </Column>
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AccountsView;
