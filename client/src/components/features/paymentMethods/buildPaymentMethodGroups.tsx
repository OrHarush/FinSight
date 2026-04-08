import { Typography } from '@mui/material';
import i18n, { TFunction } from 'i18next';

import { SelectOptionGroup } from '@/components/shared/inputs/RHFGroupedSelect';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { getPaymentMethodDisplayName, PAYMENT_TYPE_GROUPS } from '@/utils/entities/paymentMethod';

const getPaymentMethodLabel = (paymentMethod: PaymentMethodDto): string => {
  const tPm = i18n.getFixedT(i18n.language, 'paymentMethods') as TFunction<'paymentMethods'>;

  return getPaymentMethodDisplayName(paymentMethod, tPm);
};

export const buildPaymentMethodGroups = (
  paymentMethods: PaymentMethodDto[],
  t: TFunction
): SelectOptionGroup[] =>
  PAYMENT_TYPE_GROUPS.map(group => ({
    groupLabel: t(group.labelKey),
    options: paymentMethods
      .filter(pm => group.types.includes(pm.type))
      .map(pm => {
        const label = getPaymentMethodLabel(pm);

        return {
          label,
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
              {label}
            </Typography>
          ),
        };
      }),
  })).filter(group => group.options.length > 0);
