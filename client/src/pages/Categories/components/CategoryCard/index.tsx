import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Grid, IconButton,Typography } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CategoryDto } from '@/types/Category';
import { getCategoryDisplayName } from '@/utils/categoryUtils';

interface CategoryCardProps {
  category: CategoryDto;
  selectCategory: (category: CategoryDto) => void;
}

const CategoryCard = ({ category, selectCategory }: CategoryCardProps) => {
  const { t } = useTranslation('categories');
  const { alertSuccess, alertError } = useSnackbar();

  const IconComponent: ElementType = (category.icon && categoryIconMap[category.icon]) || CategoryIcon;

  const deleteCategory = useApiMutation<void, void>({
    method: 'delete',
    url: `${API_ROUTES.CATEGORIES}/${category._id}`,
    queryKeysToInvalidate: [queryKeys.categories()],
    options: {
      onSuccess: () => {
        alertSuccess(t('messages.deleteSuccess'));
      },
      onError: err => {
        alertError(t('messages.deleteError'));
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
          height: '80px',
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
        <CardContent sx={{ height: '100%', padding: '8px !important' }}>
          <Column height={'100%'} spacing={2} justifyContent={'center'}>
            <Row alignItems="center" justifyContent="space-between">
              <Row alignItems="center" spacing={2} sx={{ minWidth: 0, overflow: 'hidden' }}>
                <Box
                  sx={{
                    backgroundColor: `${category.color}20`,
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent sx={{ color: category.color, fontSize: 20 }} />
                </Box>
                <Typography fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getCategoryDisplayName(category, t)}
                </Typography>
              </Row>
              <IconButton onClick={handleDelete} size="medium" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Row>
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryCard;
