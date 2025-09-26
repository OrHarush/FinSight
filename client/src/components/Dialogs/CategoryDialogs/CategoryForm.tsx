import ControlledSelect from '@/components/inputs/ControlledSelect';
import TextInput from '@/components/inputs/TextInput';
import Column from '@/components/Layout/Containers/Column';
import IconPickerButton from '@/components/Dialogs/CategoryDialogs/IconPickerButton';
import ColorPickerField from '@/components/Dialogs/CategoryDialogs/ColorPicker';
import { Grid } from '@mui/material';

const CategoryForm = () => (
  <Column spacing={2}>
    <TextInput name="name" label="Name" />
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <ControlledSelect
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
    <IconPickerButton />
    <ColorPickerField />
  </Column>
);

export default CategoryForm;
