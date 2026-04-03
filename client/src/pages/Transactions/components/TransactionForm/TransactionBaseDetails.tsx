import { TransactionFormValues } from '@finsight/shared';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';

const TransactionBaseDetails = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });

  if (transactionType === 'Transfer') {
    return null;
  }

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextInput name="name" label={t('fields.name')} required maxLength={50} />
      </Grid>
    </>
  );
};

export default TransactionBaseDetails;
