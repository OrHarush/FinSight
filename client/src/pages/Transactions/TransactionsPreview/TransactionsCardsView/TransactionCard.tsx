import CategoryIcon from '@mui/icons-material/Category';
import { Chip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import SwipeableCard from '@/components/shared/ui/SwipeableCard';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import { getCardStyles } from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/styles';
import { ExpandedTransactionDto } from '@/types/Transaction';
import { isToday } from '@/utils/dateUtils';
import { getTransactionDisplayDate } from '@/utils/transactionUtils';

interface TransactionCardViewProps {
  transaction: ExpandedTransactionDto;
}

const TransactionCard = ({ transaction }: TransactionCardViewProps) => {
  const { t } = useTranslation('transactions');
  const { setSelectedTransaction, setTransactionAction } = useTransactionPageData();
  const IconComponent =
    (transaction.category?.icon && categoryIconMap[transaction.category?.icon]) || CategoryIcon;

  const isTodayTransaction = isToday(new Date(getTransactionDisplayDate(transaction)));
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
        sx={{ ...getCardStyles(isTodayTransaction) }}
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
            <Row alignItems={'center'} spacing={1}>
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
              {transaction.recurrence && transaction.recurrence !== 'None' && (
                <Chip
                  label={t(`recurrence.${transaction.recurrence.toLowerCase()}`)}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: '0.65rem', height: 18, flexShrink: 0 }}
                />
              )}
            </Row>
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
