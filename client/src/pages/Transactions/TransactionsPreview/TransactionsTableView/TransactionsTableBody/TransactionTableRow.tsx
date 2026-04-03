import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { useSnackbar } from '@/providers/SnackbarProvider';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import EditAndDeleteButtons from '@/components/shared/ui/EditAndDeleteButtons';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import RecurrenceBadge from '@/pages/Transactions/components/RecurrenceBadge';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import CategoryChip from '@/pages/Transactions/TransactionsPreview/CategoryChip';
import { ExpandedTransactionDto } from '@/types/Transaction';
import { isToday } from '@/utils/date';
import { PAYMENT_TYPE_LOCALE_KEY } from '@/utils/entities/paymentMethod';
import { getTransactionDisplayDate } from '@/utils/entities/transaction';

interface TransactionTableRowProps {
  transaction: ExpandedTransactionDto;
}

const TransactionTableRow = ({ transaction }: TransactionTableRowProps) => {
  const { t } = useTranslation('paymentMethods');
  const { t: tTx } = useTranslation('transactions');
  const { setSelectedTransaction, setTransactionAction } = useTransactionPageData();
  const getCategoryName = useCategoryName();
  const { alertError } = useSnackbar();

  const handleTransactionDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (transaction.isVirtual) {
      alertError(tTx('messages.cannotEditVirtual'));
      return;
    }

    setTransactionAction('delete');
    setSelectedTransaction(transaction);
  };

  const handleTransactionSelect = () => {
    if (transaction.isVirtual) {
      alertError(tTx('messages.cannotEditVirtual'));
      return;
    }

    setSelectedTransaction(transaction);
    setTransactionAction('edit');
  };

  const handleViewTransaction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedTransaction(transaction);
  };

  const isTodayTransaction = isToday(new Date(getTransactionDisplayDate(transaction)));
  const AccountIconComponent =
    (transaction.account?.icon && bankAccountIconMap[transaction.account.icon]) ||
    AccountBalanceIcon;

  return (
    <TableRow
      key={transaction._id}
      onClick={handleTransactionSelect}
      sx={{
        cursor: 'pointer',
        borderLeft: isTodayTransaction ? '4px solid' : 'none',
        borderLeftColor: 'primary.main',
        backgroundColor: isTodayTransaction ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
        '&:hover': {
          backgroundColor: isTodayTransaction ? 'rgba(56, 189, 248, 0.15)' : 'action.hover',
        },
        transition: 'background-color 0.2s ease',
      }}
    >
      <TableCell>
        <Row alignItems="center" spacing={1}>
          <Typography variant="body2" noWrap>
            {transaction.type === 'Transfer' ? 'Transfer' : transaction.name}
          </Typography>
          <RecurrenceBadge transaction={transaction} />
        </Row>
      </TableCell>
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
          name={getCategoryName(transaction?.category)}
          color={transaction.category?.color || '#c8c8c8'}
          icon={transaction.category?.icon}
        />
      </TableCell>
      <TableCell align="left">
        <Row alignItems="center" spacing={1}>
          <AccountIconComponent sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
          <Typography variant="body2" noWrap>
            {transaction.account?.name}
          </Typography>
        </Row>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" noWrap>
          {transaction.paymentMethod?.name ||
            (transaction.paymentMethod?.type
              ? t(`types.${PAYMENT_TYPE_LOCALE_KEY[transaction.paymentMethod.type]}`)
              : '—')}
        </Typography>
      </TableCell>
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
