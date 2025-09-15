import { Card, CardContent, Grid, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Column from '@/components/Layout/Column';

const Overview = () => {
  return (
    <Grid container width={'100%'} sx={{ bgcolor: 'red' }}>
      <Grid size={{ sm: 12, md: 3 }}>
        <Card sx={{ width: '280px', borderRadius: '8px' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'Row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
            }}
          >
            <Column spacing={1}>
              <Typography variant={'body2'}>Total Balance</Typography>
              <Typography variant={'h4'}>10000$</Typography>
            </Column>
            <AccountBalanceWalletIcon fontSize={'large'} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ sm: 12, md: 3 }}>
        <Card sx={{ width: '280px', borderRadius: '8px' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'Row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
            }}
          >
            <Column spacing={1}>
              <Typography variant={'body2'}>Total Balance</Typography>
              <Typography variant={'h4'}>10000$</Typography>
            </Column>
            <AccountBalanceWalletIcon fontSize={'large'} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ sm: 12, md: 3 }}>
        <Card sx={{ width: '280px', borderRadius: '8px' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'Row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
            }}
          >
            <Column spacing={1}>
              <Typography variant={'body2'}>Total Balance</Typography>
              <Typography variant={'h4'}>10000$</Typography>
            </Column>
            <AccountBalanceWalletIcon fontSize={'large'} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ sm: 12, md: 3 }}>
        <Card sx={{ width: '280px', borderRadius: '8px' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'Row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
            }}
          >
            <Column spacing={1}>
              <Typography variant={'body2'}>Total Balance</Typography>
              <Typography variant={'h4'}>10000$</Typography>
            </Column>
            <AccountBalanceWalletIcon fontSize={'large'} />
          </CardContent>
        </Card>
      </Grid>
      {/*<Card sx={{ width: '250px' }}>*/}
      {/*  <CardContent>*/}
      {/*    <Typography variant={'body2'}>Monthly Income</Typography>*/}
      {/*    <Typography variant={'h4'}>10000$</Typography>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Card sx={{ width: '250px' }}>*/}
      {/*  <CardContent>*/}
      {/*    <Typography variant={'body2'}>Monthly Expenses</Typography>*/}
      {/*    <Typography variant={'h4'}>10000$</Typography>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Card sx={{ width: '250px' }}>*/}
      {/*  <CardContent>*/}
      {/*    <Typography variant={'body2'}>Net Income</Typography>*/}
      {/*    <Typography variant={'h4'}>10000$</Typography>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
    </Grid>
  );
};

export default Overview;
