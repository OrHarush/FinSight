import AccountsList from '@/pages/Dashboard/AccountsOverview/AccountsList';
import AccountOverviewCardSkeleton from '@/pages/Dashboard/AccountsOverview/AccountOverviewCardSkeleton';
import Row from '@/components/Layout/Containers/Row';
import EntityError from '@/components/Entities/EntityError';
import { useAccounts } from '@/hooks/useAccounts';

const AccountsOverviewContent = () => {
  const { refetch, isLoading, error } = useAccounts();

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

  return <AccountsList />;
};

export default AccountsOverviewContent;
