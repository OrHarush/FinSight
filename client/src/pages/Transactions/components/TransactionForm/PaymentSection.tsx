import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { PaymentMethodDto } from '@/types/PaymentMethod';

const TYPE_LOCALE_KEY: Record<string, string> = {
  'Credit Card': 'creditCard',
  Debit: 'debit',
  'Bank Transfer': 'bankTransfer',
  PayPal: 'paypal',
  Bit: 'bit',
  PayBox: 'paybox',
  Cash: 'cash',
};

const PaymentSection = () => {
  const { t } = useTranslation(['transactions', 'paymentMethods']);
  const { paymentMethods } = usePaymentMethods();

  const getPaymentMethodLabel = (paymentMethod: PaymentMethodDto) => {
    if (paymentMethod.name) {
      return paymentMethod.name;
    }

    const localeKey = TYPE_LOCALE_KEY[paymentMethod.type];

    return localeKey ? t(`paymentMethods:types.${localeKey}`) : paymentMethod.type;
  };

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <RHFSelect
        name={'paymentMethod'}
        label={t('transactions:fields.paymentMethod')}
        required
        options={paymentMethods.map(paymentMethod => ({
          label: getPaymentMethodLabel(paymentMethod),
          value: paymentMethod._id,
          design: (
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {getPaymentMethodLabel(paymentMethod)}
            </Typography>
          ),
        }))}
      />
    </Grid>
  );
};

export default PaymentSection;
