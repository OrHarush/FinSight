import { useMediaQuery, useTheme } from '@mui/material';
import TransactionsCardsView from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView';
import TransactionsTableView from '@/pages/Transactions/TransactionsPreview/TransactionsTableView';
import { Dayjs } from 'dayjs';

interface TransactionsPreviewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsPreview = ({ selectedMonth, selectedCategory }: TransactionsPreviewProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? (
    <TransactionsCardsView selectedMonth={selectedMonth} selectedCategory={selectedCategory} />
  ) : (
    <TransactionsTableView selectedMonth={selectedMonth} selectedCategory={selectedCategory} />
  );
};

export default TransactionsPreview;
