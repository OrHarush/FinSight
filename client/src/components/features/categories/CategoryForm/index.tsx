import Column from '@/components/shared/layout/containers/Column';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { CategoryFormValues } from '@/types/Category';
import CategoryPreview from '@/components/features/categories/CategoryForm/CategoryPreview';
import TextInput from '@/components/shared/inputs/TextInput';
import RHFSelect from '@/components/shared/inputs/RHFSelect';

const CategoryForm = () => {
  const { t } = useTranslation('categories');
  const { control } = useFormContext<CategoryFormValues>();

  const name = useWatch({ control, name: 'name' });
  const icon = useWatch({ control, name: 'icon' });
  const color = useWatch({ control, name: 'color' });
  const categoryType = useWatch({ control, name: 'type' });

  return (
    <Column spacing={2}>
      <CategoryPreview name={name} icon={icon} color={color} />
      <TextInput name="name" label={t('fields.name')} required />
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <RHFSelect
            name="type"
            label={t('fields.type')}
            options={[
              { value: 'Income', label: t('options.income') },
              { value: 'Expense', label: t('options.expense') },
            ]}
          />
        </Grid>
        {categoryType === 'Expense' && (
          <Grid size={{ xs: 6 }}>
            <TextInput
              name="monthlyLimit"
              label={t('fields.monthlyBudget')}
              type="number"
              min={0}
            />
          </Grid>
        )}
      </Grid>
    </Column>
  );
};

export default CategoryForm;
