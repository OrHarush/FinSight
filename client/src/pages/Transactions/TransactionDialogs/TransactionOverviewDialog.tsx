import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth,
  AccountBalance,
  Repeat,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
} from '@mui/icons-material';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import CategoryChip from '@/pages/Transactions/TransactionsPreview/CategoryChip';
import { ExpandedTransactionDto } from '@/types/Transaction';
import { getTransactionDisplayDate } from '@/utils/transactionUtils';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useTranslation } from 'react-i18next';

interface TransactionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transaction: ExpandedTransactionDto | null;
}

const TransactionOverviewDialog = ({
  open,
  onClose,
  transaction,
}: TransactionDetailsModalProps) => {
  const { t } = useTranslation('transactions');

  if (!transaction) {
    return null;
  }

  const getTransactionIcon = () => {
    if (transaction.type === 'Transfer') return <SwapHoriz sx={{ fontSize: 32 }} />;
    if (transaction.type === 'Expense') return <TrendingDown sx={{ fontSize: 32 }} />;
    return <TrendingUp sx={{ fontSize: 32 }} />;
  };

  const getTransactionColor = () => {
    if (transaction.type === 'Transfer') {
      return transaction.account?._id === transaction.fromAccount?._id
        ? 'error.main'
        : 'success.main';
    }
    return transaction.type === 'Expense' ? 'error.main' : 'success.main';
  };

  const displayDate = new Date(getTransactionDisplayDate(transaction)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Row justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('details.title')}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Row>
      </DialogTitle>
      <DialogContent>
        <Column spacing={2}>
          <Column alignItems="center" spacing={2} sx={{ py: 2 }}>
            <Column
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'action.hover',
                color: getTransactionColor(),
              }}
            >
              {getTransactionIcon()}
            </Column>
            <Column alignItems="center" spacing={0.5}>
              <Typography variant="h4" fontWeight="bold">
                <CurrencyText value={transaction.amount} color={getTransactionColor()} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transaction.type === 'Transfer'
                  ? 'Transfer'
                  : transaction.name || 'Unnamed Transaction'}
              </Typography>
            </Column>
          </Column>
          <Divider />
          <Column spacing={2.5}>
            <Row justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('fields.category')}
              </Typography>
              <CategoryChip
                name={transaction?.category?.name || 'Uncategorized'}
                color={transaction?.category?.color || '#c8c8c8'}
                icon={transaction?.category?.icon}
              />
            </Row>
            {transaction.type === 'Transfer' ? (
              <>
                <Row justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('fields.fromAccount')}
                  </Typography>
                  <Row spacing={1} alignItems="center">
                    <AccountBalance sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {transaction.fromAccount?.name || 'N/A'}
                    </Typography>
                  </Row>
                </Row>
                <Row justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('fields.toAccount')}
                  </Typography>
                  <Row spacing={1} alignItems="center">
                    <AccountBalance sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1">{transaction.toAccount?.name || 'N/A'}</Typography>
                  </Row>
                </Row>
              </>
            ) : (
              <Row justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('fields.account')}
                </Typography>
                <Row spacing={1} alignItems="center">
                  <AccountBalance sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body1">{transaction.account?.name || 'N/A'}</Typography>
                </Row>
              </Row>
            )}
            <Row justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('fields.date')}
              </Typography>
              <Row spacing={1} alignItems="center">
                <CalendarMonth sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body1">{displayDate}</Typography>
              </Row>
            </Row>

            {/* Recurrence */}
            {transaction.recurrence !== 'None' && (
              <Row justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('fields.recurrence')}
                </Typography>
                <Row spacing={1} alignItems="center">
                  <Repeat sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Chip label={transaction.recurrence} size="small" variant="outlined" />
                </Row>
              </Row>
            )}
          </Column>
          <Divider />
          <Column spacing={1}>
            <Typography variant="caption" color="text.secondary">
              {t('details.created')}: {new Date(transaction.createdAt).toLocaleString('en-GB')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('details.updated')}: {new Date(transaction.updatedAt).toLocaleString('en-GB')}
            </Typography>
          </Column>
        </Column>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionOverviewDialog;
