import { Box, Card, Typography } from '@mui/material';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import CategoryTransactionsList from './CategoryTransactionsList';
import { useTranslation } from 'react-i18next';

interface TransactionsPanelProps {
  selectedCategory: CategoryDto | null;
  transactions: TransactionDto[];
  isLoading: boolean;
}

const TransactionsPanel = ({
  selectedCategory,
  transactions,
  isLoading,
}: TransactionsPanelProps) => {
  const { t } = useTranslation('budget');

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: '500px', sm: '350px', md: 'auto' },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">{t('transactions.title')}</Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <CategoryTransactionsList
          category={selectedCategory}
          transactions={transactions}
          isLoading={isLoading}
        />
      </Box>
    </Card>
  );
};

export default TransactionsPanel;
