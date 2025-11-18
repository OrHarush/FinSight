import TextInput from '@/components/inputs/TextInput';
import RHFSelect from '@/components/inputs/RHFSelect';
import Column from '@/components/layout/Containers/Column';
import { Grid, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PaymentMethodForm = () => {
  const { t } = useTranslation('paymentMethods');

  return (
    <Column spacing={2}>
      {/* Name */}
      <TextInput name="name" label={t('fields.name')} required />

      {/* Type */}
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

      {/* Billing Day + Last 4 */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextInput
            name="billingDay"
            label={t('fields.billingDay')}
            type="number"
            min={1}
            max={31}
            required
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextInput name="last4" label={t('fields.last4')} type="text" maxLength={4} />
        </Grid>
      </Grid>

      {/* Primary */}
      <FormControlLabel control={<Checkbox name="isPrimary" />} label={t('fields.isPrimary')} />
    </Column>
  );
};

export default PaymentMethodForm;
