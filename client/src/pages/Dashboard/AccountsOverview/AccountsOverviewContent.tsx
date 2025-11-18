import AccountsList from '@/pages/Dashboard/AccountsOverview/AccountsList';
import AccountOverviewCardSkeleton from '@/pages/Dashboard/AccountsOverview/AccountOverviewCardSkeleton';
import Row from '@/components/layout/Containers/Row';
import EntityError from '@/components/entities/EntityError';
import { useAccounts } from '@/hooks/entities/useAccounts';
import EntityEmpty from '@/components/entities/EntityEmpty';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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
    return <EntityEmpty entityName={'accounts'} icon={AccountBalanceWalletIcon} />;
  }

  return <AccountsList />;
};

export default AccountsOverviewContent;
