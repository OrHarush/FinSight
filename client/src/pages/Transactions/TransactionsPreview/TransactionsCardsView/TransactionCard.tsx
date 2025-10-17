import Paper from '@mui/material/Paper';
import { ExpandedTransactionDto } from '@/types/Transaction';
import { Typography } from '@mui/material';
import EditAndDeleteButtons from '@/components/appCommon/EditAndDeleteButtons';
import CurrencyText from '@/components/appCommon/CurrencyText';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import * as Icons from '@mui/icons-material';
import { ElementType } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';

interface TransactionCardViewProps {
  transaction: ExpandedTransactionDto;
}

const TransactionCard = ({ transaction }: TransactionCardViewProps) => {
  const { alertSuccess, alertError } = useSnackbar();
  const { setSelectedTransaction } = useSelectedTransaction();
  const IconComponent =
    (transaction.category?.icon &&
      (Icons as Record<string, ElementType>)[transaction.category?.icon]) ||
    CategoryIcon;

  const isTransfer = transaction.type === 'Transfer';

  const amountColor = isTransfer
    ? transaction.account?._id === transaction.fromAccount?._id
      ? 'error.main'
      : 'success.main'
    : transaction?.category?.type === 'Expense'
      ? 'error.main'
      : 'success.main';

  const deleteTransaction = useApiMutation<void, void>({
    method: 'delete',
    url: `${API_ROUTES.TRANSACTIONS}/${transaction._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
    options: {
      onSuccess: () => {
        alertSuccess('Transaction deleted');
      },
      onError: err => {
        alertError('Failed to delete transaction');
        console.error('❌ Failed to delete transaction', err);
      },
    },
  });

  return (
    <Paper
      key={transaction._id}
      onClick={() => setSelectedTransaction(transaction)}
      sx={{
        p: '14px 20px',
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'transparent',
          transition: 'background 0.2s ease',
        },
        '&:hover': {
          backgroundColor: 'action.hover',
          paddingLeft: '23px',
        },
        '&:hover::before': {
          background: 'linear-gradient(180deg, #7c6bea, #ff6b9d)',
        },
        '&:first-of-type': {
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        },
        '&:last-of-type': {
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          borderBottom: 'none',
        },
      }}
    >
      <Column
        sx={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          backgroundColor: 'action.selected',
          flexShrink: 0,
        }}
      >
        <IconComponent
          color={transaction.category?.color}
          sx={{ color: transaction.category?.color }}
        />
      </Column>
      <Column sx={{ flex: 1, minWidth: 0 }}>
        <Row justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isTransfer ? 'Transfer' : transaction.name}
          </Typography>
          <CurrencyText
            variant="body1"
            fontWeight={700}
            value={transaction.amount}
            color={amountColor}
            sx={{ ml: 1.5, flexShrink: 0 }}
          />
        </Row>
        <Row
          display="flex"
          justifyContent="space-between"
          sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
        >
          <Typography variant="caption" color="text.secondary">
            {transaction?.category?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(transaction.date).toLocaleDateString()}
          </Typography>
        </Row>
      </Column>
      <EditAndDeleteButtons
        onConfirmDelete={deleteTransaction.mutate}
        onEdit={() => setSelectedTransaction(transaction)}
      />
    </Paper>
  );
};

export default TransactionCard;
