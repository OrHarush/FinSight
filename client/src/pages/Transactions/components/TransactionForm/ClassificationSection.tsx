import { useTranslation } from 'react-i18next';
import CategoriesSelect from '@/components/features/categories/CategoriesSelect';
import { Grid, InputLabel, Skeleton } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import { useCategories } from '@/hooks/entities/useCategories';

interface ClassificationSectionProps {
  isFullWidth?: boolean;
}

const ClassificationSection = ({ isFullWidth = false }: ClassificationSectionProps) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const { categories, isLoading } = useCategories();

  const transactionType = useWatch({ control, name: 'type' });

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  const gridSize = { xs: 12, sm: isFullWidth ? 12 : 6 };

  return !isLoading ? (
    <Grid size={gridSize}>
      <CategoriesSelect filteredCategories={filteredCategories} />
    </Grid>
  ) : (
    <Grid size={gridSize}>
      <InputLabel>{t('fields.category')}</InputLabel>
      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
    </Grid>
  );
};

export default ClassificationSection;
