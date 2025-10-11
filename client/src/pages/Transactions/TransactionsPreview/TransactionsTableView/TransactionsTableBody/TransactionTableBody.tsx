import { TableBody, TableCell, TableRow } from '@mui/material';
import TransactionTableRow from './TransactionTableRow';
import EntityEmpty from '@/components/Entities/EntityEmpty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { ExtendedTransaction } from '@/types/Transaction';

interface TransactionTableBodyProps {
  filteredTransactions: ExtendedTransaction[];
  page: number;
  rowsPerPage: number;
}

const TransactionTableBody = ({
  filteredTransactions,
  page,
  rowsPerPage,
}: TransactionTableBodyProps) => {
  const paginated = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableBody>
      {filteredTransactions.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <EntityEmpty
              entityName="transactions"
              subtitle="Start by adding your first one"
              icon={ReceiptLongIcon}
            />
          </TableCell>
        </TableRow>
      ) : (
        paginated.map(tx => <TransactionTableRow key={tx._id} transaction={tx} />)
      )}
    </TableBody>
  );
};

export default TransactionTableBody;
