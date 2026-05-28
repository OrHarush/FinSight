import { useMediaQuery, useTheme } from '@mui/material';

import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';

const TransactionsPreview = () => {
  const theme = useTheme();
  const showCards = useMediaQuery(theme.breakpoints.down('lg'));

  return showCards ? <TransactionsCardsView /> : <TransactionsTableView />;
};

export default TransactionsPreview;
