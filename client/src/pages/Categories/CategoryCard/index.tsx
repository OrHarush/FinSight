import { Card, CardContent, Typography, Box, Grid, IconButton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import * as Icons from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { ElementType } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useSnackbar } from '@/providers/SnackbarProvider';
import BudgetProgress from '@/pages/Categories/CategoryCard/BudgetProgess';
import Column from '@/components/layout/Containers/Column';
import NoBudget from '@/pages/Categories/CategoryCard/NoBudget';
import { CategoryDto } from '@/types/Category';
import { useTransactions } from '@/hooks/useTransactions';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  category: CategoryDto;
  selectCategory: (category: CategoryDto) => void;
}

const CategoryCard = ({ category, selectCategory }: CategoryCardProps) => {
  const { t } = useTranslation('categories');
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
        alertSuccess(t('messages.delete_success'));
      },
      onError: err => {
        alertError(t('messages.delete_error'));
        console.error('❌ Failed to delete category', err);
      },
    },
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteCategory.mutate();
  };

  return (
    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        onClick={() => selectCategory(category)}
        sx={{
          width: '280px',
          height: '120px',
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
        <CardContent sx={{ padding: '8px !important' }}>
          <Column spacing={2}>
            <Row alignItems="center" justifyContent="space-between">
              <Row alignItems="center" spacing={2}>
                <Box
                  sx={{
                    backgroundColor: `${category.color}20`,
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent sx={{ color: category.color, fontSize: 20 }} />
                </Box>
                <Typography fontWeight={500}>{category.name}</Typography>
              </Row>
              <IconButton onClick={handleDelete} size="medium" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
              {/*<EditAndDeleteButtons*/}
              {/*  onConfirmDelete={deleteCategory.mutate}*/}
              {/*  onEdit={() => selectCategory(category)}*/}
              {/*/>*/}
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
