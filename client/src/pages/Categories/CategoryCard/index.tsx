import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import * as Icons from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { ElementType } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import BudgetProgress from '@/pages/Categories/CategoryCard/BudgetProgess';
import EditAndDeleteButtons from '@/components/EditAndDeleteButtons';
import Column from '@/components/Layout/Containers/Column';
import NoBudget from '@/pages/Categories/CategoryCard/NoBudget';
import { CategoryDto } from '@/types/Category';
import { useTransactions } from '@/hooks/useTransactions';

interface CategoryCardProps {
  category: CategoryDto;
  selectCategory: (category: CategoryDto) => void;
}

const CategoryCard = ({ category, selectCategory }: CategoryCardProps) => {
  const { alertSuccess, alertError } = useSnackbar();
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

  const deleteCategory = useApiMutation<void, void>({
    method: 'delete',
    url: `${API_ROUTES.CATEGORIES}/${category._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
    options: {
      onSuccess: () => {
        alertSuccess('Category deleted');
      },
      onError: err => {
        alertError('Failed to delete category');
        console.error('❌ Failed to delete category', err);
      },
    },
  });

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Card
        sx={{
          width: '280px',
          height: '120px',
          borderRadius: '12px',
          paddingX: 2,
          paddingY: 1,
        }}
      >
        <CardContent sx={{ padding: '8px !important' }}>
          <Column spacing={2}>
            <Row alignItems="center" justifyContent="space-between">
              <Row alignItems="center" spacing={2}>
                <Box
                  sx={{
                    backgroundColor: category.color || 'green',
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent />
                </Box>
                <Typography fontWeight={500}>{category.name}</Typography>
              </Row>
              <EditAndDeleteButtons
                onDelete={() => deleteCategory.mutate()}
                onEdit={() => selectCategory(category)}
              />
            </Row>
            {category.monthlyLimit ? (
              <BudgetProgress spent={spent} limit={category.monthlyLimit} />
            ) : (
              <NoBudget />
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryCard;
