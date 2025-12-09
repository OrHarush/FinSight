import { IconButton, TableCell, TableRow } from '@mui/material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import CategoryChip from '@/pages/Transactions/TransactionsPreview/CategoryChip';
import EditAndDeleteButtons from '@/components/appCommon/EditAndDeleteButtons';
import { useTransactinPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import { getTransactionDisplayDate } from '@/utils/transactionUtils';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Row from '@/components/layout/Containers/Row';
import { ExpandedTransactionDto } from '@/types/Transaction';

interface TransactionTableRowProps {
  transaction: ExpandedTransactionDto;
}

const TransactionTableRow = ({ transaction }: TransactionTableRowProps) => {
  const { setSelectedTransaction, setTransactionAction } = useTransactinPageData();

  const handleTransactionDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setTransactionAction('delete');
    setSelectedTransaction(transaction);
  };

  const handleTransactionSelect = () => {
    setSelectedTransaction(transaction);
    setTransactionAction('edit');
  };

  const handleViewTransaction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedTransaction(transaction);
  };

  const isToday = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const highlight = isToday(new Date(getTransactionDisplayDate(transaction)));

  return (
    <TableRow
      key={transaction._id}
      onClick={handleTransactionSelect}
      sx={{
        cursor: 'pointer',
        borderLeft: highlight ? '4px solid' : 'none',
        borderLeftColor: 'primary.main',
        backgroundColor: highlight ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
        '&:hover': {
          backgroundColor: highlight ? 'rgba(56, 189, 248, 0.15)' : 'action.hover',
        },
        transition: 'background-color 0.2s ease',
      }}
    >
      <TableCell>{transaction.type === 'Transfer' ? 'Transfer' : transaction.name}</TableCell>
      <TableCell align="left">
        <CurrencyText
          value={transaction.amount}
          color={
            transaction.type === 'Transfer'
              ? transaction.account?._id === transaction.fromAccount?._id
                ? 'error.main'
                : 'success.main'
              : transaction?.type === 'Expense'
                ? 'error.main'
                : 'success.main'
          }
        />
      </TableCell>
      <TableCell align="left">
        <CategoryChip
          name={transaction?.category?.name || 'Uncategorized'}
          color={transaction?.category?.color || '#c8c8c8'}
          icon={transaction?.category?.icon}
        />
      </TableCell>
      <TableCell align="left">{transaction.account?.name}</TableCell>
      <TableCell align="left">{transaction.recurrence}</TableCell>
      <TableCell align="left">
        {new Date(getTransactionDisplayDate(transaction)).toLocaleDateString('en-GB')}
      </TableCell>
      <TableCell align="center">
        <Row>
          <IconButton
            onClick={handleViewTransaction}
            size="medium"
            aria-label={`View ${transaction.name}`}
          >
            <RemoveRedEyeIcon fontSize="small" />
          </IconButton>
          <EditAndDeleteButtons
            onDelete={e => handleTransactionDelete(e)}
            onEdit={handleTransactionSelect}
          />
        </Row>
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
