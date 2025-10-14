import RHFSelect from '@/components/inputs/RHFSelect';
import TextInput from '@/components/inputs/TextInput';
import Column from '@/components/layout/Containers/Column';
import ColorPickerField from '@/components/dialogs/CategoryDialogs/ColorPicker';
import { Grid } from '@mui/material';
import IconPickerField from '@/components/dialogs/IconPicker/IconPickerButton';
import { categoryIcons } from '@/constants/CategoryIcons';
import { useTranslation } from 'react-i18next';

const CategoryForm = () => {
  const { t } = useTranslation('categories');

  return (
    <Column spacing={2}>
      <TextInput name="name" label={t('fields.name')} />
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
        <Grid size={{ xs: 6 }}>
          <TextInput name="monthlyLimit" label={t('fields.monthlyLimit')} type="number" min={0} />
        </Grid>
      </Grid>
      <IconPickerField icons={categoryIcons} defaultIcon="CategoryIcon" label={t('fields.icon')} />
      <ColorPickerField label={t('fields.color')} />
    </Column>
  );
};

export default CategoryForm;
