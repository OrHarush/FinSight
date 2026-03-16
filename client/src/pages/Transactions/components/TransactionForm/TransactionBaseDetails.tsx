import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
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
        <TextInput name="name" label={t('fields.name')} required />
      </Grid>
      {!isRecurring && (
        <Grid size={{ xs: 12, sm: isTransfer ? 12 : 6 }}>
          <TextInput name="date" label={t('fields.date')} type="date" />
        </Grid>
      )}
    </>
  );
};

export default TransactionBaseDetails;
