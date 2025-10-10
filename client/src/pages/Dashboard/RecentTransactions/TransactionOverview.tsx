import Row from '@/components/Layout/Containers/Row';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import Column from '@/components/Layout/Containers/Column';
import { Typography, Box } from '@mui/material';
import { TransactionDto } from '@/types/Transaction';
import * as Icons from '@mui/icons-material';

interface TransactionOverviewProps {
  transaction: TransactionDto;
}

const TransactionOverview = ({ transaction }: TransactionOverviewProps) => {
  const isIncome = (transaction: TransactionDto) => transaction?.category?.type === 'Income';

  const isNew = (transactionDate: string | Date) => {
    const now = new Date();
    const txDate = new Date(transactionDate);
    const diffInHours = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  const CategoryIcon = transaction.category?.icon
    ? Icons[transaction.category.icon as keyof typeof Icons]
    : null;

  return (
    <Row
      key={transaction._id}
      justifyContent="space-between"
      alignItems="center"
      sx={{
        borderRadius: 1,
        p: 1,
        '&:hover': {
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
        },
      }}
    >
      <Row spacing={2} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: transaction.category?.color
              ? `${transaction.category.color}20`
              : 'rgba(139, 92, 246, 0.1)',
          }}
        >
          {CategoryIcon ? (
            <CategoryIcon
              sx={{
                fontSize: 20,
                color: transaction.category?.color || '#a78bfa',
              }}
            />
          ) : isIncome(transaction) ? (
            <CallReceivedIcon sx={{ fontSize: 20, color: 'success.main' }} />
          ) : (
            <CallMadeIcon sx={{ fontSize: 20, color: 'error.main' }} />
          )}
        </Box>
        <Column>
          <Row spacing={1} alignItems="center">
            <Typography variant="body1" fontWeight={500}>
              {transaction.name}
            </Typography>
            {isNew(transaction.date) && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'rgba(139, 92, 246, 0.2)',
                  color: '#a78bfa',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontWeight: 600,
                  fontSize: '0.65rem',
                }}
              >
                NEW
              </Typography>
            )}
          </Row>
          <Row spacing={1} alignItems="center">
            {transaction.category && (
              <>
                <Typography variant="caption" color="text.secondary">
                  {transaction.category.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
              </>
            )}
            <Typography variant="caption" color="text.secondary">
              {new Date(transaction.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          </Row>
        </Column>
      </Row>
      <Typography color={isIncome(transaction) ? 'success.main' : 'error.main'} fontWeight={600}>
        {isIncome(transaction) ? `+${transaction.amount}₪` : `-${transaction.amount}₪`}
      </Typography>
    </Row>
  );
};

export default TransactionOverview;
