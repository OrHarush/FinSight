import { TYPES_REQUIRING_NAME } from '@finsight/shared';
import { PaymentMethodType } from '@finsight/shared';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import TextInput from '@/components/shared/inputs/TextInput';

const PaymentMethodForm = () => {
  const { t } = useTranslation(['paymentMethods', 'common']);
  const { control } = useFormContext();
  const paymentType = useWatch({ control, name: 'type' }) as PaymentMethodType | undefined;

  const nameRequiredForType = paymentType ? TYPES_REQUIRING_NAME.includes(paymentType) : false;
  const nameLabel = nameRequiredForType
    ? t('paymentMethods:fields.name')
    : `${t('paymentMethods:fields.name')} (${t('common:fields.optional')})`;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <RHFSelect
          name="type"
          label={t('paymentMethods:fields.type')}
          options={[
            { value: 'Credit Card', label: t('paymentMethods:types.creditCard') },
            { value: 'Debit', label: t('paymentMethods:types.debit') },
            { value: 'Bank Transfer', label: t('paymentMethods:types.bankTransfer') },
            { value: 'PayPal', label: t('paymentMethods:types.paypal') },
            { value: 'Bit', label: t('paymentMethods:types.bit') },
            { value: 'PayBox', label: t('paymentMethods:types.paybox') },
            { value: 'Cash', label: t('paymentMethods:types.cash') },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextInput name="name" label={nameLabel} />
      </Grid>
      <Grid size={{ xs: 6, sm: 5 }}>
        {(paymentType === 'Credit Card' || paymentType === 'Debit') && (
          <TextInput
            name="lastFourDigits"
            label={t('paymentMethods:fields.lastFourDigits')}
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
            label={t('paymentMethods:fields.billingDay')}
            type="number"
            placeholder={t('paymentMethods:fields.billingDayPlaceholder')}
            helperText={t('paymentMethods:fields.billingDayHelper')}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default PaymentMethodForm;
