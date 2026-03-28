import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { TableBody, TableCell, TableRow } from '@mui/material';

import EntityEmpty from '@/components/entities/EntityEmpty';
import { ExpandedTransactionDto } from '@/types/Transaction';

import TransactionTableRow from './TransactionTableRow';

interface TransactionTableBodyProps {
  transactions: ExpandedTransactionDto[];
}

const TransactionTableBody = ({ transactions }: TransactionTableBodyProps) => (
  <TableBody>
    {transactions.length === 0 ? (
      <TableRow sx={{ height: '100%' }}>
        <TableCell colSpan={7} align="center" sx={{ verticalAlign: 'middle', border: 0 }}>
          <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />
        </TableCell>
      </TableRow>
    ) : (
      transactions.map(tx => <TransactionTableRow key={tx._id} transaction={tx} />)
    )}
  </TableBody>
);

export default TransactionTableBody;
