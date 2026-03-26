import LoadingScreen from '@/components/shared/feedback/LoadingScreen';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import { useHasAnyTransaction } from '@/hooks/business/useHasAnyTransaction';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import OverviewDashboard from '@/pages/Overview/OverviewDashboard';
import { OverviewFiltersProvider } from '@/pages/Overview/OverviewFiltersProvider';
import SetupPanel from '@/pages/Overview/SetupPanel/SetupPanel';

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
          <OverviewDashboard />
        </OverviewFiltersProvider>
      ) : (
        <SetupPanel />
      )}
    </PageLayout>
  );
};

export default Overview;
