import { ElementType } from 'react';
import { CategoryDto } from '@/types/Category';
import { Box, Card, CardContent, Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import * as Icons from '@mui/icons-material';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import BudgetProgress from '@/pages/Categories/CategoryCard/BudgetProgess';
import NoBudget from '@/pages/Categories/CategoryCard/NoBudget';
import { useTransactions } from '@/hooks/entities/useTransactions';

interface BudgetCategoryCardProps {
  category: CategoryDto;
  onSelect?: (category: CategoryDto) => void;
  isSelected?: boolean;
}

const BudgetCategoryCard = ({ category, onSelect, isSelected }: BudgetCategoryCardProps) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const { transactions } = useTransactions(currentYear, currentMonth);

  const spent = transactions.reduce((sum, tx) => {
    if (!tx.date) return sum;

    const txDate = new Date(tx.date);

    if (
      tx.category?._id === category._id &&
      tx.category?.type === 'Expense' &&
      txDate.getFullYear() === currentYear &&
      txDate.getMonth() === currentMonth
    ) {
      return sum + tx.amount;
    }
    return sum;
  }, 0);

  const IconComponent =
    (category.icon && (Icons as Record<string, ElementType>)[category.icon]) || CategoryIcon;

  return (
    <Card
      onClick={() => onSelect?.(category)}
      sx={{
        borderRadius: '12px',
        paddingX: 2,
        paddingY: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        backgroundColor: isSelected ? 'action.selected' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        width: '100%',
        minHeight: '120px',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          transform: 'translateY(-2px)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ width: '100%', padding: '8px !important' }}>
        <Row width={'100%'} height="100px" spacing={2} alignItems={'center'}>
          <Box
            sx={{
              backgroundColor: `${category.color}20`,
              borderRadius: '12px',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent sx={{ color: category.color, fontSize: 36 }} />
          </Box>
          <Column>
            <Row alignItems="center" justifyContent="space-between">
              <Row alignItems="center" spacing={2}>
                <Typography fontWeight={500}>{category.name}</Typography>
              </Row>
            </Row>
            {category.monthlyLimit ? (
              <BudgetProgress spent={spent} limit={category.monthlyLimit} />
            ) : (
              <NoBudget totalCategorySpending={spent} />
            )}
          </Column>
        </Row>
      </CardContent>
    </Card>
  );
};

export default BudgetCategoryCard;
