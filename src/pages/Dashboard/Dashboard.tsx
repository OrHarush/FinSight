import PageLayout from '@/components/Layout/PageLayout';
import Column from '@/components/Layout/Column';
import Overview from '@/pages/Dashboard/Overview';
import { Grid } from '@mui/material';

const Dashboard = () => {
  return (
    <PageLayout>
      {/*<Column height="100%" width={'1300px'} spacing={2}>*/}
      <Grid container spacing={2} height="100%" width={'100%'}>
        {/*<Grid size={4}>*/}
        {/*  <DashboardHeader />*/}
        {/*</Grid>*/}
        <Column height={'100%'} width={'100%'} spacing={2}>
          {/*<Grid size={4}>*/}
          <Overview />
          {/*</Grid>*/}
          {/*<Grid size={4}>*/}
          {/*  <BalanceTrend />{' '}*/}
          {/*</Grid>*/}
          {/*<Grid size={4}>*/}
          {/*  <RecentTransactions />*/}
          {/*</Grid>*/}
        </Column>
      </Grid>

      {/*</Column>*/}
    </PageLayout>
  );
};

export default Dashboard;
