import { useMediaQuery, useTheme } from '@mui/material';
import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';
import { Dayjs } from 'dayjs';

interface TransactionsPreviewProps {
  selectedCategory: string;
  selectedMonth: Dayjs;
}

const TransactionsPreview = ({ selectedMonth, selectedCategory }: TransactionsPreviewProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? (
    <TransactionsCardsView selectedCategory={selectedCategory} selectedMonth={selectedMonth} />
  ) : (
    <TransactionsTableView selectedCategory={selectedCategory} selectedMonth={selectedMonth} />
  );
};

export default TransactionsPreview;
