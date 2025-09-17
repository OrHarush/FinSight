import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { useTransactions } from '@/providers/TransactionsProvider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TransactionsTable = () => {
  const { transactions, isLoading, error } = useTransactions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) {
    return <Typography>Loading…</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  return (
    <>
      {!isMobile ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions?.map(t => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell align="right">{t.amount}</TableCell>
                  <TableCell align="right">{t.category.name}</TableCell>
                  <TableCell align="right">{new Date(t.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // 👉 Mobile view: Card list
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
              {/* Header row: name + actions */}
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

              {/* Amount */}
              <Typography
                variant="h6"
                color={transaction.amount < 0 ? 'error.main' : 'success.main'}
              >
                {transaction.amount}₪
              </Typography>

              {/* Category + Date */}
              <Typography variant="body2" color="text.secondary">
                Category: {transaction.category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(transaction.date).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </>
  );
};

export default TransactionsTable;
