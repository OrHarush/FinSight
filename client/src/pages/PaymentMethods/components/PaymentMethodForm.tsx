import { TYPES_REQUIRING_NAME } from '@finsight/shared';
import { PaymentMethodType } from '@finsight/shared';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import TextInput from '@/components/shared/inputs/TextInput';
import { PAYMENT_TYPE_GROUPS, PAYMENT_TYPE_LOCALE_KEY } from '@/utils/paymentMethodUtils';

const PaymentMethodForm = () => {
  const { t } = useTranslation(['paymentMethods', 'common']);
  const { control } = useFormContext();
  const paymentType = useWatch({ control, name: 'type' }) as PaymentMethodType | undefined;

  const nameRequiredForType = paymentType ? TYPES_REQUIRING_NAME.includes(paymentType) : false;
  const nameLabel = nameRequiredForType
    ? t('paymentMethods:fields.name')
    : `${t('paymentMethods:fields.name')} (${t('common:fields.optional')})`;

  const typeGroups = PAYMENT_TYPE_GROUPS.map(group => ({
    groupLabel: t(group.labelKey),
    options: group.types.map(type => ({
      value: type,
      label: t(`paymentMethods:types.${PAYMENT_TYPE_LOCALE_KEY[type]}`),
    })),
  }));

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <RHFGroupedSelect name="type" label={t('paymentMethods:fields.type')} groups={typeGroups} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextInput name="name" label={nameLabel} />
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
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
