import { useMediaQuery, useTheme } from '@mui/material';
import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';

const TransactionsPreview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? <TransactionsCardsView /> : <TransactionsTableView />;
};

export default TransactionsPreview;
