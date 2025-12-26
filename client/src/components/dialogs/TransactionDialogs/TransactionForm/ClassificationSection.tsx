import { useTranslation } from 'react-i18next';
import CategoriesSelect from '@/components/categories/CategoriesSelect';
import { Grid, InputLabel, Skeleton } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import { useCategories } from '@/hooks/entities/useCategories';

const ClassificationSection = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const { categories, isLoading } = useCategories();

  const transactionType = useWatch({ control, name: 'type' });

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  if (transactionType === 'Transfer') {
    return null;
  }

  return !isLoading ? (
    <Grid size={{ xs: 12, sm: 6 }}>
      <CategoriesSelect filteredCategories={filteredCategories} />
    </Grid>
  ) : (
    <Grid size={{ xs: 12, sm: 6 }}>
      <InputLabel>{t('fields.category')}</InputLabel>
      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
    </Grid>
  );
};

export default ClassificationSection;
