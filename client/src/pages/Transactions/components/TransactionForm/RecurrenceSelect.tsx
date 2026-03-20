import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';

const RecurrenceSelect = () => {
  const { t } = useTranslation('transactions');

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <RHFSelect
        name="recurrence"
        label={t('fields.recurrence')}
        required
        options={[
          { value: 'None', label: t('recurrence.none') },
          { value: 'Monthly', label: t('recurrence.monthly') },
          { value: 'Yearly', label: t('recurrence.yearly') },
        ]}
      />
    </Grid>
  );
};

export default RecurrenceSelect;
