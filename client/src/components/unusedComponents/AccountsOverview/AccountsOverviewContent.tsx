import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import Row from '@/components/shared/layout/containers/Row';
import AccountOverviewCardSkeleton from '@/components/unusedComponents/AccountsOverview/AccountOverviewCardSkeleton';
import AccountsList from '@/components/unusedComponents/AccountsOverview/AccountsList';
import { useAccounts } from '@/hooks/entities/useAccounts';

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
