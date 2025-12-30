import { Grid } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import TextInput from '@/components/shared/inputs/TextInput';
import RHFSelect from '@/components/shared/inputs/RHFSelect';

const ScheduleSection = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();

  const recurrence = useWatch({ control, name: 'recurrence' });

  return (
    <Column spacing={2}>
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
      <Grid container spacing={2}>
        {recurrence === 'None' ? (
          <Grid size={{ xs: 12 }}>
            <TextInput name="date" label={t('fields.date')} type="date" />
          </Grid>
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextInput name="startDate" label={t('fields.startDate')} type="date" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextInput name="endDate" label={t('fields.endDate')} type="month" />
            </Grid>
          </>
        )}
      </Grid>
    </Column>
  );
};

export default ScheduleSection;
