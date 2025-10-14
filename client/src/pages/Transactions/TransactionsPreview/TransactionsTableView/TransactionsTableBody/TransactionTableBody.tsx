import { TableBody, TableCell, TableRow } from '@mui/material';
import TransactionTableRow from './TransactionTableRow';
import EntityEmpty from '@/components/entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { ExpandedTransactionDto } from '@/types/Transaction';

interface TransactionTableBodyProps {
  transactions: ExpandedTransactionDto[];
}

const TransactionTableBody = ({ transactions }: TransactionTableBodyProps) => (
  <TableBody>
    {transactions.length === 0 ? (
      <TableRow>
        <TableCell colSpan={7} align="center">
          <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />
        </TableCell>
      </TableRow>
    ) : (
      transactions.map(tx => <TransactionTableRow key={tx._id} transaction={tx} />)
    )}
  </TableBody>
);

export default TransactionTableBody;
