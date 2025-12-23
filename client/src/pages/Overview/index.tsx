import OverviewHeader from '@/pages/Overview/OverviewHeader';
import { Grid } from '@mui/material';
import PageLayout from '@/components/layout/Page/PageLayout';
import { OverviewFiltersProvider } from '@/pages/Overview/OverviewFiltersProvider';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import SetupPanel from '@/pages/Overview/SetupPanel/SetupPanel';
import { useHasAnyTransaction } from '@/hooks/useHasAnyTransaction';
import LoadingScreen from '@/components/common/LoadingScreen';
import MonthlyFinancialHealth from '@/pages/Overview/MonthlyFinancialHealth';
import MonthlyFinancialOverview from '@/pages/Overview/MonthlyFinancialOverview';
import CategoryLimits from '@/pages/Overview/CategoryLimits';
import TopSpendingCategories from '@/pages/Overview/TopSpendingCategories';

const Overview = () => {
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
        <OverviewFiltersProvider>
          <OverviewHeader />
          <Grid container spacing={4}>
            <Grid container spacing={4} size={{ xs: 12 }}>
              <MonthlyFinancialOverview />
              <MonthlyFinancialHealth />
            </Grid>
            <Grid container spacing={4} size={{ xs: 12 }} maxHeight={'300px'}>
              <CategoryLimits />
              <TopSpendingCategories />
            </Grid>
          </Grid>
        </OverviewFiltersProvider>
      ) : (
        <SetupPanel />
      )}
    </PageLayout>
  );
};

export default Overview;
