import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { buildPaymentMethodGroups } from '@/components/features/paymentMethods/buildPaymentMethodGroups';
import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';

const PaymentSection = () => {
  const { t } = useTranslation(['transactions', 'paymentMethods']);
  const { paymentMethods } = usePaymentMethods();

  const groups = buildPaymentMethodGroups(paymentMethods, t);

  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <RHFGroupedSelect
        name={'paymentMethod'}
        label={t('transactions:fields.paymentMethod')}
        required
        groups={groups}
      />
    </Grid>
  );
};

export default PaymentSection;
