import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';
import Row from '@/components/layout/Containers/Row';
import { useTranslation } from 'react-i18next';

const TransactionsTableSkeleton = () => {
  const { t } = useTranslation('transactions');

  return (
    <>
      <Row spacing={4} alignItems="center">
        <Row spacing={1} alignItems="center">
          <Typography color="text.secondary">{t('totals.expenses')}:</Typography>
          <Skeleton variant="rectangular" height={24} width={70} sx={{ borderRadius: 2 }} />
        </Row>
        <Row spacing={1} alignItems="center">
          <Typography color="text.secondary">{t('totals.income')}:</Typography>
          <Skeleton variant="rectangular" height={24} width={70} sx={{ borderRadius: 2 }} />
        </Row>
      </Row>
      <TableContainer component={Paper}>
        <Table
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            '& th': {
              backgroundColor: 'background.paper',
              fontWeight: 600,
              color: 'text.primary',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& td': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
          aria-label="transactions table"
        >
          <TransactionTableHeaders />
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="60%" height={24} />
                </TableCell>
                <TableCell align="left">
                  <Skeleton variant="text" width="80px" height={24} />
                </TableCell>
                <TableCell align="left">
                  <Skeleton
                    variant="rounded"
                    width={150}
                    height={36}
                    sx={{ borderRadius: '24px' }}
                  />
                </TableCell>
                <TableCell align="left">
                  <Skeleton variant="text" width="70%" height={24} />
                </TableCell>
                <TableCell align="left">
                  <Skeleton variant="text" width="60px" height={24} />
                </TableCell>
                <TableCell align="left">
                  <Skeleton variant="text" width="90px" height={24} />
                </TableCell>
                <TableCell align="center">
                  <Row spacing={1} justifyContent="center">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Row>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TransactionsTableSkeleton;
