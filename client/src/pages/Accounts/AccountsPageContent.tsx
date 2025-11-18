import { Grid } from '@mui/material';
import AccountCard from '@/pages/Accounts/AccountCard';
import AccountCardSkeleton from '@/pages/Accounts/AccountCardSkeleton';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { AccountDto } from '@/types/Account';
import EntityError from '@/components/entities/EntityError';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EntityEmpty from '@/components/entities/EntityEmpty';

interface AccountContentPageProps {
  selectAccount: (account: AccountDto) => void;
}

const AccountsPageContent = ({ selectAccount }: AccountContentPageProps) => {
  const { accounts, isLoading, error, refetch } = useAccounts();

  if (error) {
    return <EntityError entityName={'accounts'} refetch={refetch} />;
  }

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AccountCardSkeleton />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AccountCardSkeleton />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AccountCardSkeleton />
        </Grid>
      </Grid>
    );
  }

  if (!accounts.length) {
    return <EntityEmpty entityName={'accounts'} icon={AccountBalanceWalletIcon} />;
  }

  return (
    <Grid container spacing={3}>
      {accounts?.map(account => (
        <Grid key={account._id} size={{ xs: 12, sm: 6, md: 4 }}>
          <AccountCard account={account} selectAccount={selectAccount} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AccountsPageContent;
