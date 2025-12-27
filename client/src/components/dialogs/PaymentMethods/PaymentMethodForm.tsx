import TextInput from '@/components/inputs/TextInput';
import RHFSelect from '@/components/inputs/RHFSelect';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { PaymentMethodFormValues } from '@/types/PaymentMethod';
import { Grid } from '@mui/material';

const PaymentMethodForm = () => {
  const { t } = useTranslation('paymentMethods');
  const { control } = useFormContext<PaymentMethodFormValues>();
  const paymentType = useWatch({ control, name: 'type' });

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextInput name="name" label={t('fields.name')} required />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RHFSelect
          name="type"
          label={t('fields.type')}
          required
          options={[
            { value: 'Credit', label: t('types.credit') },
            { value: 'Debit', label: t('types.debit') },
            { value: 'BankTransfer', label: t('types.bankTransfer') },
            { value: 'PayPal', label: t('types.paypal') },
            { value: 'Other', label: t('types.other') },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 5 }}>
        {(paymentType === 'Credit' || paymentType === 'Debit') && (
          <TextInput
            name="last4"
            label={t('fields.last4')}
            type="text"
            maxLength={4}
            rules={{
              pattern: {
                value: /^\d{4}$/,
                message: t('validation.last4Format'),
              },
            }}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, sm: 7 }}>
        {paymentType === 'Credit' && (
          <TextInput
            name="billingDay"
            label={t('fields.billingDay')}
            type="number"
            placeholder={t('fields.billingDayPlaceholder')}
            helperText={t('fields.billingDayHelper')}
            min={1}
            max={31}
            required
          />
        )}
      </Grid>
    </Grid>
  );
};

export default PaymentMethodForm;
