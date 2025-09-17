import FinancialHighlights from '@/pages/Dashboard/FinancialHighlights';
import RecentTransactions from '@/pages/Dashboard/RecentTransactions';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import AccountsView from '@/pages/Dashboard/AccountsView';
import MonthlyExpensesChart from '@/pages/Dashboard/MonthlyExpensesChart';
import { Grid } from '@mui/material';
import PageLayout from '@/components/Layout/PageLayout';

const Dashboard = () => (
  <PageLayout>
    <DashboardHeader />
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <FinancialHighlights />
      </Grid>
      <Grid container size={{ xs: 12 }} spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <MonthlyExpensesChart />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <AccountsView />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentTransactions />
        </Grid>
      </Grid>
    </Grid>
  </PageLayout>
);

export default Dashboard;
