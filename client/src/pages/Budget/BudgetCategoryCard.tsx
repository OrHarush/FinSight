import { ElementType } from 'react';
import { CategoryDto } from '@/types/Category';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import * as Icons from '@mui/icons-material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import BudgetProgress from '@/pages/Categories/CategoryCard/BudgetProgess';
import NoBudget from '@/pages/Categories/CategoryCard/NoBudget';
import { useTransactions } from '@/hooks/entities/useTransactions';

interface BudgetCategoryCardProps {
  category: CategoryDto;
}

const BudgetCategoryCard = ({ category }: BudgetCategoryCardProps) => {
  const { transactions } = useTransactions();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const spent = transactions.reduce((sum, tx) => {
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
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card
        // onClick={() => selectCategory(category)}
        sx={{
          width: '280px',
          borderRadius: '12px',
          paddingX: 2,
          paddingY: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          border: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
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
    </Grid>
  );
};

export default BudgetCategoryCard;
