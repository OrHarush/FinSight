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
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import TransactionTableHeaders from '@/pages/Transactions/TransactionsPreview/TransactionsTableView/TransactionTableHeaders';

const TransactionsTableSkeleton = () => {
  const { t } = useTranslation('transactions');

  return (
    <Column height={'100%'} minHeight={0} spacing={2}>
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
      <Paper
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}
      >
        <TableContainer sx={{ flex: 1, minHeight: 0 }}>
          <Table
            stickyHeader
            aria-label="transactions table"
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
          >
            <TransactionTableHeaders order="desc" orderBy="date" onSort={() => {}} />
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="50%" height={24} />
                  </TableCell>
                  <TableCell align="left">
                    <Skeleton variant="text" width="60px" height={24} />
                  </TableCell>
                  <TableCell align="left">
                    <Skeleton
                      variant="rounded"
                      width={150}
                      height={36}
                      sx={{ borderRadius: '8px' }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Skeleton variant="text" width="70px" height={24} />
                  </TableCell>
                  <TableCell align="left">
                    <Skeleton variant="text" width="60px" height={24} />
                  </TableCell>
                  <TableCell align="left">
                    <Skeleton variant="text" width="80px" height={24} />
                  </TableCell>
                  <TableCell align="left">
                    <Row spacing={1} justifyContent="center">
                      <Skeleton variant="circular" width={30} height={30} />
                      <Skeleton variant="circular" width={30} height={30} />
                      <Skeleton variant="circular" width={30} height={30} />
                    </Row>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Skeleton
          variant="rectangular"
          height={52}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Paper>
    </Column>
  );
};

export default TransactionsTableSkeleton;
