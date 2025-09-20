import { Box, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CurrencyText from '@/components/CurrencyText';
import { useTransactions } from '@/providers/TransactionsProvider';

const TransactionCardsView = () => {
  const { transactions } = useTransactions();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {transactions?.map(transaction => (
        <Paper
          key={transaction._id}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={700}>
              {transaction.name}
            </Typography>
            <Box>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <CurrencyText
            variant="h6"
            color={transaction?.category?.type == 'Expense' ? 'error.main' : 'success.main'}
            value={transaction.amount}
          />
          <Typography variant="body2" color="text.secondary">
            Category: {transaction?.category?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(transaction.date).toLocaleDateString()}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default TransactionCardsView;
