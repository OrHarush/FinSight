import { Grid } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { buildPaymentMethodGroups } from '@/components/features/paymentMethods/buildPaymentMethodGroups';
import RHFGroupedSelect from '@/components/shared/inputs/RHFGroupedSelect';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';

interface PaymentSectionProps {
  smSize?: number;
}

const PaymentSection = ({ smSize = 6 }: PaymentSectionProps) => {
  const { t } = useTranslation(['transactions', 'paymentMethods']);
  const { paymentMethods } = usePaymentMethods();
  const { control, setValue } = useFormContext();
  const paymentMethod = useWatch({ control, name: 'paymentMethod' });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setValue('belongToPreviousMonth', false, { shouldDirty: true });
  }, [paymentMethod]);

  const groups = buildPaymentMethodGroups(paymentMethods, t);

  return (
    <Grid size={{ xs: 12, sm: smSize }}>
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
