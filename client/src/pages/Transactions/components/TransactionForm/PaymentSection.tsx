import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';

const PaymentSection = () => {
  const { t } = useTranslation('transactions');
  const { paymentMethods } = usePaymentMethods();

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <RHFSelect
        name={'paymentMethod'}
        label={t('fields.paymentMethod')}
        required
        options={paymentMethods.map(paymentMethod => ({
          label: paymentMethod.name,
          value: paymentMethod._id,
          design: (
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
              {paymentMethod.name}
            </Typography>
          ),
        }))}
      />
    </Grid>
  );
};

export default PaymentSection;
