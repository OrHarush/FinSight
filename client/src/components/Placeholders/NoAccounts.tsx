import { Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PlaceholderContainer from '@/components/Placeholders/PlaceholderContainer';

const NoAccounts = () => (
  <PlaceholderContainer>
    <AccountBalanceWalletIcon sx={{ fontSize: 48, opacity: 0.6 }} />
    <Typography variant="body1">No accounts yet</Typography>
    <Typography variant="body2">Add your first account to start tracking balances</Typography>
  </PlaceholderContainer>
);

export default NoAccounts;
