import Paper from '@mui/material/Paper';
import { ExpandedTransactionDto } from '@/types/Transaction';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import { useTransactinPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import * as Icons from '@mui/icons-material';
import { ElementType } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import SwipeableCard from '@/components/SwipeableCard';
import { getTransactionDisplayDate } from '@/utils/transactionUtils';

interface TransactionCardViewProps {
  transaction: ExpandedTransactionDto;
}

const TransactionCard = ({ transaction }: TransactionCardViewProps) => {
  const { setSelectedTransaction, setTransactionAction } = useTransactinPageData();
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

  const setTransactionToEdit = () => {
    setSelectedTransaction(transaction);
    setTransactionAction('edit');
  };

  const setTransactionToDelete = () => {
    setSelectedTransaction(transaction);
    setTransactionAction('delete');
  };

  return (
    <SwipeableCard onDelete={setTransactionToDelete}>
      <Paper
        key={transaction._id}
        onClick={setTransactionToEdit}
        sx={{
          p: '18px 20px',
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
          '.swipeable-wrapper:first-of-type &': {
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          },
          '.swipeable-wrapper:last-of-type &': {
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
        <Row width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
          <Column>
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
            <Typography variant="caption" color="text.secondary">
              {new Date(getTransactionDisplayDate(transaction)).toLocaleDateString()}
            </Typography>
          </Column>
          <CurrencyText
            variant="body1"
            fontWeight={700}
            value={transaction.amount}
            color={amountColor}
            sx={{ ml: 1.5, flexShrink: 0 }}
          />
        </Row>
      </Paper>
    </SwipeableCard>
  );
};

export default TransactionCard;
