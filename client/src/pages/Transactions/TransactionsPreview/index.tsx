import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTransactions } from '@/providers/EntitiesProviders/TransactionsProvider';
import TransactionCardsView from '@/pages/Transactions/TransactionsPreview/TransactionCardView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';

const TransactionsPreview = () => {
  const { isLoading, error } = useTransactions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) {
    return <Typography>Loading…</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  return isMobile ? <TransactionCardsView /> : <TransactionsTableView />;
};

export default TransactionsPreview;
