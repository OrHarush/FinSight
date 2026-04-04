import { Typography } from '@mui/material';
import { TFunction } from 'i18next';

import { SelectOptionGroup } from '@/components/shared/inputs/RHFGroupedSelect';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { PAYMENT_TYPE_GROUPS, PAYMENT_TYPE_LOCALE_KEY } from '@/utils/entities/paymentMethod';

const getPaymentMethodLabel = (paymentMethod: PaymentMethodDto, t: TFunction): string => {
  if (paymentMethod.name) {
    return paymentMethod.name;
  }

  const localeKey = PAYMENT_TYPE_LOCALE_KEY[paymentMethod.type];

  return localeKey ? t(`paymentMethods:types.${localeKey}`) : paymentMethod.type;
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
        const label = getPaymentMethodLabel(pm, t);

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
