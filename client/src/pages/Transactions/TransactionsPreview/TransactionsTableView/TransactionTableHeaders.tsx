import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SortableColumn, SortOrder } from '@/types/Transaction';

interface TransactionTableHeadersProps {
  order: SortOrder;
  orderBy: SortableColumn;
  onSort: (column: SortableColumn) => void;
}

const TransactionTableHeaders = ({ order, orderBy, onSort }: TransactionTableHeadersProps) => {
  const { t } = useTranslation('transactions');

  const getSortedTableCell = (column: SortableColumn, label: string, width: string) => (
    <TableCell sx={{ width }}>
      <TableSortLabel
        active={orderBy === column}
        direction={orderBy === column ? order : 'asc'}
        onClick={() => onSort(column)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <TableHead>
      <TableRow>
        {getSortedTableCell('name', t('table.name'), '15%')}
        {getSortedTableCell('amount', t('table.amount'), '10%')}
        {getSortedTableCell('category', t('table.category'), '20%')}
        {getSortedTableCell('account', t('table.account'), '15%')}
        {getSortedTableCell('paymentMethod', t('table.paymentMethod'), '20%')}
        {getSortedTableCell('date', t('table.date'), '15%')}
        <TableCell sx={{ width: '5%' }} align="center">
          {t('table.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TransactionTableHeaders;
