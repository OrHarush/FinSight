import Column from '@/components/shared/layout/containers/Column';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { CategoryFormValues } from '@/types/Category';
import CategoryPreview from '@/components/features/categories/components/CategoryForm/CategoryPreview';
import TextInput from '@/components/shared/inputs/TextInput';
import CategoryTypeToggle from '@/components/features/categories/components/CategoryForm/CategoryTypeToggle';

const CategoryForm = () => {
  const { t } = useTranslation('categories');
  const { control } = useFormContext<CategoryFormValues>();

  const categoryType = useWatch({ control, name: 'type' });

  return (
    <Column spacing={3}>
      <Column spacing={1.5}>
        <CategoryPreview />
        <TextInput name="name" label={t('fields.name')} required />
      </Column>
      <Box
        sx={{
          alignSelf: 'center',
          px: 1,
          py: 0.5,
          borderRadius: 2,
        }}
      >
        <CategoryTypeToggle />
      </Box>
      {categoryType === 'Expense' && (
        <TextInput name="monthlyLimit" label={t('fields.monthlyBudget')} type="number" min={0} />
      )}
    </Column>
  );
};

export default CategoryForm;
