import FinancialHighlights from '@/pages/Dashboard/FinancialHighlights';
import RecentTransactions from '@/pages/Dashboard/RecentTransactions';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import AccountsOverview from '@/pages/Dashboard/AccountsOverview';
import YearlyChart from '@/pages/Dashboard/YearlyChart';
import { Grid } from '@mui/material';
import PageLayout from '@/components/layout/PageLayout';
import { DashboardFiltersProvider } from '@/pages/Dashboard/DashboardFiltersProvider';

const Dashboard = () => (
  <PageLayout>
    <DashboardFiltersProvider>
      <DashboardHeader />
      <Grid container spacing={3}>
        <FinancialHighlights />
        <Grid container size={{ xs: 12 }} spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              <YearlyChart />
              <AccountsOverview />
            </Grid>
          </Grid>
          <RecentTransactions />
        </Grid>
      </Grid>
    </DashboardFiltersProvider>
  </PageLayout>
);

export default Dashboard;
