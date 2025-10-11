import AccountsList from '@/pages/Dashboard/AccountsOverview/AccountsList';
import AccountOverviewCardSkeleton from '@/pages/Dashboard/AccountsOverview/AccountOverviewCardSkeleton';
import Row from '@/components/Layout/Containers/Row';
import EntityError from '@/components/Entities/EntityError';
import { useAccounts } from '@/hooks/useAccounts';
import AccountsEmpty from '@/components/Accounts/AccountsEmpty';

const AccountsOverviewContent = () => {
  const { accounts, refetch, isLoading, error } = useAccounts();

  if (error) {
    return <EntityError entityName={'accounts'} refetch={refetch} />;
  }

  if (isLoading) {
    return (
      <Row spacing={2}>
        <AccountOverviewCardSkeleton />
        <AccountOverviewCardSkeleton />
        <AccountOverviewCardSkeleton />
      </Row>
    );
  }

  if (!accounts.length) {
    return <AccountsEmpty />;
  }

  return <AccountsList />;
};

export default AccountsOverviewContent;
