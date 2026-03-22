import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { PAYMENT_TYPE_GROUPS, PAYMENT_TYPE_LOCALE_KEY } from '@/utils/paymentMethodUtils';

const getPaymentMethodLabel = (paymentMethod: PaymentMethodDto, t: (key: string) => string) => {
  if (paymentMethod.name) {
    return paymentMethod.name;
  }

  const localeKey = PAYMENT_TYPE_LOCALE_KEY[paymentMethod.type];

  return localeKey ? t(`paymentMethods:types.${localeKey}`) : paymentMethod.type;
};

const PaymentSection = () => {
  const { t } = useTranslation(['transactions', 'paymentMethods']);
  const { paymentMethods } = usePaymentMethods();

  const instanceGroups = PAYMENT_TYPE_GROUPS.map(group => ({
    groupLabel: t(group.labelKey),
    options: paymentMethods
      .filter(pm => group.types.includes(pm.type))
      .map(pm => ({
        label: getPaymentMethodLabel(pm, t),
        value: pm._id,
        design: (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {getPaymentMethodLabel(pm, t)}
          </Typography>
        ),
      })),
  })).filter(group => group.options.length > 0);

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <RHFGroupedSelect
        name={'paymentMethod'}
        label={t('transactions:fields.paymentMethod')}
        required
        groups={instanceGroups}
      />
    </Grid>
  );
};

export default PaymentSection;
