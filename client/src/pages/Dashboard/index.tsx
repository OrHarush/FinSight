import FinancialHighlights from '@/pages/Dashboard/FinancialHighlights';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import DashboardCharts from '@/pages/Dashboard/DashboardCharts';
import { Grid } from '@mui/material';
import PageLayout from '@/components/layout/Page/PageLayout';
import { DashboardFiltersProvider } from '@/pages/Dashboard/DashboardFiltersProvider';
import TopSpendingCategories from '@/pages/Dashboard/TopSpendingCategories';

const Dashboard = () => (
  <PageLayout>
    <DashboardFiltersProvider>
      <DashboardHeader />
      <Grid container spacing={3} height={'100%'}>
        <FinancialHighlights />
        <DashboardCharts />
        <TopSpendingCategories />
      </Grid>
    </DashboardFiltersProvider>
  </PageLayout>
);

export default Dashboard;
