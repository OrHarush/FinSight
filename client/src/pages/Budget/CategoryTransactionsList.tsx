import { Box, List, ListItem, ListItemText, Typography, Chip, Skeleton } from '@mui/material';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import * as Icons from '@mui/icons-material';
import { ElementType } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

interface CategoryTransactionsListProps {
  category: CategoryDto | null;
  transactions: TransactionDto[];
  isLoading?: boolean;
}

const CategoryTransactionsList = ({
  category,
  transactions,
  isLoading,
}: CategoryTransactionsListProps) => {
  if (!category) {
    return (
      <Column
        sx={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'text.secondary',
        }}
      >
        <Box textAlign="center">
          <Typography variant="body1">Select a category to view transactions</Typography>
        </Box>
      </Column>
    );
  }

  const categoryTransactions = transactions.filter(tx => tx.category?._id === category._id);
  const totalAmount = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const IconComponent =
    (category.icon && (Icons as Record<string, ElementType>)[category.icon]) || DeleteIcon;

  if (isLoading) {
    return (
      <Column spacing={2}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
        ))}
      </Column>
    );
  }

  return (
    <Column spacing={1} height="100%" sx={{ overflow: 'hidden' }}>
      <Box
        sx={{
          backgroundColor: `${category.color}10`,
          border: '1px solid',
          borderColor: `${category.color}40`,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Row alignItems="center" spacing={2} mb={2}>
          <Box
            sx={{
              backgroundColor: `${category.color}20`,
              borderRadius: '8px',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconComponent sx={{ color: category.color, fontSize: 24 }} />
          </Box>
          <Column spacing={0}>
            <Typography variant="h6">{category.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {categoryTransactions.length}{' '}
              {categoryTransactions.length === 1 ? 'transaction' : 'transactions'}
            </Typography>
          </Column>
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Total spent:
          </Typography>
          <Chip
            label={`₪${totalAmount.toLocaleString()}`}
            sx={{
              backgroundColor: `${category.color}20`,
              color: category.color,
              fontWeight: 600,
            }}
          />
        </Row>
      </Box>
      {categoryTransactions.length === 0 ? (
        <Column
          sx={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">No transactions for this category</Typography>
        </Column>
      ) : (
        <List sx={{ flex: 1, overflow: 'auto', width: '100%' }}>
          {categoryTransactions.map(tx => (
            <ListItem
              key={tx._id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 1.5,
                px: 1,
              }}
            >
              <Row justifyContent="space-between" alignItems="center" width="100%">
                <ListItemText
                  primary={tx.name || 'No description'}
                  secondary={tx.date ? new Date(tx.date).toLocaleDateString() : 'No date'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    color: category.type === 'Income' ? 'success.main' : 'error.main',
                    ml: 2,
                    flexShrink: 0,
                  }}
                >
                  {category.type === 'Income' ? '+' : '-'}₪{tx.amount.toLocaleString()}
                </Typography>
              </Row>
              {tx.account && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  Account: {tx.account.name}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Column>
  );
};

export default CategoryTransactionsList;
