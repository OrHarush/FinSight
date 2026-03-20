import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import TextInput from '@/components/shared/inputs/TextInput';
import { CreatePaymentMethodDTO } from '@finsight/shared';

const PaymentMethodForm = () => {
  const { t } = useTranslation('paymentMethods');
  const { control } = useFormContext<CreatePaymentMethodDTO>();
  const paymentType = useWatch({ control, name: 'type' });

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextInput name="name" label={t('fields.name')} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RHFSelect
          name="type"
          label={t('fields.type')}
          options={[
            { value: 'Credit Card', label: t('types.creditCard') },
            { value: 'Debit', label: t('types.debit') },
            { value: 'PayPal', label: t('types.paypal') },
            { value: 'Bit', label: t('types.bit') },
            { value: 'PayBox', label: t('types.paybox') },
            { value: 'Cash', label: t('types.cash') },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 5 }}>
        {(paymentType === 'Credit Card' || paymentType === 'Debit') && (
          <TextInput
            name="lastFourDigits"
            label={t('fields.lastFourDigits')}
            type="text"
            slotProps={{
              htmlInput: {
                maxLength: 4,
                inputMode: 'numeric',
              },
            }}
          />
        )}
      </Grid>
      <Grid size={{ xs: 12, sm: 7 }}>
        {paymentType === 'Credit Card' && (
          <TextInput
            name="billingDay"
            label={t('fields.billingDay')}
            type="number"
            placeholder={t('fields.billingDayPlaceholder')}
            helperText={t('fields.billingDayHelper')}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default PaymentMethodForm;
