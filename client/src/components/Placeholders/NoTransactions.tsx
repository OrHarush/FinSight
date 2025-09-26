import { Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PlaceholderContainer from '@/components/Placeholders/PlaceholderContainer';

const NoTransactions = () => (
  <PlaceholderContainer>
    <ReceiptLongIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
    <Typography variant="body1">No transactions yet</Typography>
    <Typography variant="body2">Start by adding your first one</Typography>
  </PlaceholderContainer>
);

export default NoTransactions;
