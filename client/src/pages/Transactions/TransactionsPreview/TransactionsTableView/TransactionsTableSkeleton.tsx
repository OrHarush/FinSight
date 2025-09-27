import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';

const TransactionsTableSkeleton = () => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 800 }} aria-label="transactions table">
      <TransactionTableHeaders />
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} align="center">
            <Skeleton
              variant="rectangular"
              width={'100%'}
              height={'600px'}
              sx={{ borderRadius: '12px' }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default TransactionsTableSkeleton;
