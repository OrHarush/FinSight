import Column from '@/components/shared/layout/containers/Column';
import TextInput from '@/components/shared/inputs/TextInput';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/entities/useCategories';
import CategoriesSelect from '@/components/features/categories/CategoriesSelect';
import { BudgetFormValues } from '@/types/Budget';

interface BudgetFormProps {
  showCategorySelect?: boolean;
  isEditing?: boolean;
}

const BudgetForm = ({ showCategorySelect = false, isEditing = false }: BudgetFormProps) => {
  const { t } = useTranslation('budget');
  const { control, register } = useFormContext<BudgetFormValues>();
  const { categories } = useCategories();
  const expenseCategories = categories.filter(c => c.type === 'Expense');

  const applyToRestOfYear = useWatch({ control, name: 'applyToRestOfYear' });

  return (
    <Column spacing={2}>
      {showCategorySelect && <CategoriesSelect filteredCategories={expenseCategories} />}
      <TextInput name="limit" label={t('dialog.limitLabel')} type="number" required min={0.01} />
      {!isEditing && (
        <FormControlLabel
          control={<Checkbox checked={!!applyToRestOfYear} {...register('applyToRestOfYear')} />}
          label={t('dialog.applyToYear')}
        />
      )}
    </Column>
  );
};

export default BudgetForm;
