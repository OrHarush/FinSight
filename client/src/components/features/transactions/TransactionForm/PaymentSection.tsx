import { TransactionFormValues } from '@/types/Transaction';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import RHFSelect from '@/components/shared/inputs/RHFSelect';

const PaymentSection = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const { paymentMethods } = usePaymentMethods();
  const paymentMethodId = useWatch({ control, name: 'paymentMethod' });
  const paymentMethod = paymentMethods.find(paymentMethod => paymentMethod._id === paymentMethodId);

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <RHFSelect
        name={'paymentMethod'}
        label={t('fields.paymentMethod')}
        required
        options={paymentMethods.map(paymentMethod => ({
          label: paymentMethod.name,
          value: paymentMethod._id,
        }))}
      />
      {paymentMethod?.type !== 'Credit' && (
        <FormControlLabel
          control={
            <Controller
              name="belongToPreviousMonth"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                />
              )}
            />
          }
          label={t('fields.countTowardPreviousMonth')}
        />
      )}
    </Grid>
  );
};

export default PaymentSection;
