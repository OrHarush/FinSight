import Column from '@/components/Layout/Column';
import Overview from '@/pages/Dashboard/Overview';
import BalanceTrend from '@/pages/Dashboard/BalanceTrend';
import RecentTransactions from '@/pages/Dashboard/RecentTransactions';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import Row from '@/components/Layout/Row';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Dashboard = () => {
  return (
    <Column height="100%" width={'1200px'} spacing={4} alignSelf={'center'}>
      <DashboardHeader />
      <Column height={'100%'} width={'100%'} spacing={4}>
        <Overview />
        <Row width={'100%'} spacing={4}>
          <Column width={'100%'} spacing={4}>
            <BalanceTrend />
            <RecentTransactions />
          </Column>
          <Card sx={{ width: '600px', height: '300px' }}>
            <CardContent sx={{ padding: 4 }}>
              <Column spacing={2}>
                <Typography>Accounts</Typography>
                {/*{accounts.map(account => (*/}
                {/*  <Paper key={account.name} elevation={1} sx={{ padding: 2, borderRadius: '12px' }}>*/}
                {/*    <Row justifyContent={'space-between'}>*/}
                {/*      <Row spacing={1}>*/}
                {/*        <AccountBalanceIcon />*/}
                {/*        <Typography>{account.name}</Typography>*/}
                {/*      </Row>*/}
                {/*      <Typography>{account.balance}</Typography>*/}
                {/*    </Row>*/}
                {/*  </Paper>*/}
                {/*))}*/}
                <Button variant={'outlined'} sx={{ borderRadius: '12px' }}>
                  Manage Accounts
                </Button>
              </Column>
            </CardContent>
          </Card>
        </Row>
      </Column>
    </Column>
  );
};

export default Dashboard;
