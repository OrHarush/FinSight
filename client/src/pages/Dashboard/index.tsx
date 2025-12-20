import FinancialHighlights from '@/pages/Dashboard/FinancialHighlights';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import DashboardCharts from '@/pages/Dashboard/DashboardCharts';
import { Grid } from '@mui/material';
import PageLayout from '@/components/layout/Page/PageLayout';
import { DashboardFiltersProvider } from '@/pages/Dashboard/DashboardFiltersProvider';
import TopSpendingCategories from '@/pages/Dashboard/TopSpendingCategories';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import DashboardSetupPanel from '@/pages/Dashboard/DashboardSetupPanel';
import { useHasAnyTransaction } from '@/hooks/useHasAnyTransaction';
import LoadingScreen from '@/components/common/LoadingScreen';

const Dashboard = () => {
  const { accounts, isLoading: loadingAccounts } = useAccounts();
  const { paymentMethods, isLoading: loadingPaymentMethods } = usePaymentMethods();
  const { hasAnyTransaction, isLoading: loadingTransactions } = useHasAnyTransaction();

  const hasAccount = accounts.length > 0;
  const hasPaymentMethod = paymentMethods.length > 0;
  const isLoading = loadingAccounts || loadingPaymentMethods || loadingTransactions;

  const isSetupComplete = hasAccount && hasPaymentMethod && hasAnyTransaction;

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingScreen />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {isSetupComplete ? (
        <DashboardFiltersProvider>
          <DashboardHeader />
          <Grid container spacing={3} height={'100%'}>
            <FinancialHighlights />
            <DashboardCharts />
            <TopSpendingCategories />
          </Grid>
        </DashboardFiltersProvider>
      ) : (
        <DashboardSetupPanel />
      )}
    </PageLayout>
  );
};

export default Dashboard;
