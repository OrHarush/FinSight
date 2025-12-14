import FinancialHighlights from '@/pages/Dashboard/FinancialHighlights';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import AccountsOverview from '@/pages/Dashboard/AccountsOverview';
import DashboardCharts from '@/pages/Dashboard/DashboardCharts';
import { Grid } from '@mui/material';
import PageLayout from '@/components/layout/Page/PageLayout';
import { DashboardFiltersProvider } from '@/pages/Dashboard/DashboardFiltersProvider';
import FinancialHealthIndicator from '@/pages/Dashboard/FinancialHighlights/FinancialHealthIndicator';
import TopSpendingCategories from '@/pages/Dashboard/TopSpendingCategories';

const Dashboard = () => (
  <PageLayout>
    <DashboardFiltersProvider>
      <DashboardHeader />
      <FinancialHealthIndicator />
      <Grid container spacing={3}>
        <FinancialHighlights />
        <Grid container size={{ xs: 12 }} spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              <DashboardCharts />
              <AccountsOverview />
            </Grid>
          </Grid>
          <TopSpendingCategories />
        </Grid>
      </Grid>
    </DashboardFiltersProvider>
  </PageLayout>
);

export default Dashboard;
