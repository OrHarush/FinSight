import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EntityEmpty from '@/components/Entities/EntityEmpty';

const AccountsEmpty = () => (
  <EntityEmpty
    entityName={'accounts'}
    subtitle={'Add your first account to start tracking balances'}
    icon={AccountBalanceWalletIcon}
  />
);

export default AccountsEmpty;
