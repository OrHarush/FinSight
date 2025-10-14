import RHFSelect from '@/components/inputs/RHFSelect';
import TextInput from '@/components/inputs/TextInput';
import Column from '@/components/layout/Containers/Column';
import ColorPickerField from '@/components/dialogs/CategoryDialogs/ColorPicker';
import { Grid } from '@mui/material';
import IconPickerField from '@/components/dialogs/IconPicker/IconPickerButton';
import { categoryIcons } from '@/constants/CategoryIcons';

const CategoryForm = () => (
  <Column spacing={2}>
    <TextInput name="name" label="Name" />
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <RHFSelect
          name="type"
          label="Type"
          options={[
            { value: 'Income', label: 'Income' },
            { value: 'Expense', label: 'Expense' },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <TextInput name="monthlyLimit" label="Monthly Limit" type={'number'} min={0} />
      </Grid>
    </Grid>
    <IconPickerField icons={categoryIcons} defaultIcon={'CategoryIcon'} />
    <ColorPickerField />
  </Column>
);

export default CategoryForm;
