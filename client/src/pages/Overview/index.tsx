import OverviewHeader from '@/pages/Overview/OverviewHeader';
import { Grid } from '@mui/material';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { OverviewFiltersProvider } from '@/pages/Overview/OverviewFiltersProvider';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import SetupPanel from '@/pages/Overview/SetupPanel/SetupPanel';
import { useHasAnyTransaction } from '@/hooks/business/useHasAnyTransaction';
import LoadingScreen from '@/components/shared/feedback/LoadingScreen';
import MonthlyFinancialHealth from '@/pages/Overview/MonthlyFinancialHealth';
import MonthlyFinancialOverview from '@/pages/Overview/MonthlyFinancialOverview';
import BudgetsOverview from '@/pages/Overview/BudgetsOverview';
import TopSpendingCategories from '@/pages/Overview/TopSpendingCategories';
import MonthlyInsight from '@/pages/Overview/MonthlyInsight';
import Column from '@/components/shared/layout/containers/Column';

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
          <Column height={'100%'} minHeight={0} spacing={2} sx={{ flex: 1 }}>
            <OverviewHeader />
            <MonthlyInsight />
            <Column height={'100%'} minHeight={0} spacing={4} sx={{ flex: 1 }}>
              <Grid container spacing={4} size={{ xs: 12 }}>
                <MonthlyFinancialOverview />
                <MonthlyFinancialHealth />
              </Grid>

              <Grid container size={{ xs: 12 }} spacing={4} alignItems={'stretch'} sx={{ flex: 1, minHeight: 0 }}>
                <BudgetsOverview />
                <TopSpendingCategories />
              </Grid>
            </Column>
          </Column>
        </OverviewFiltersProvider>
      ) : (
        <SetupPanel />
      )}
    </PageLayout>
  );
};

export default Overview;
