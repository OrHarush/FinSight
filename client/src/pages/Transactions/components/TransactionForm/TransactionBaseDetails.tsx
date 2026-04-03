import { TransactionFormValues } from '@finsight/shared';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import TextInput from '@/components/shared/inputs/TextInput';

const TransactionBaseDetails = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });
  const recurrence = useWatch({ control, name: 'recurrence' });

  const isRecurring = recurrence !== 'None';
  const isTransfer = transactionType === 'Transfer';

  if (transactionType === 'Transfer') {
    return null;
  }

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextInput name="name" label={t('fields.name')} required maxLength={50} />
      </Grid>
      {!isRecurring && (
        <Grid size={{ xs: 12, sm: isTransfer ? 12 : 6 }}>
          <RHFDatePicker name="date" label={t('fields.date')} />
        </Grid>
      )}
    </>
  );
};

export default TransactionBaseDetails;
