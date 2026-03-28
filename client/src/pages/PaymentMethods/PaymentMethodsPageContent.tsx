import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import Column from '@/components/shared/layout/containers/Column';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import PaymentMethodCard from '@/pages/PaymentMethods/components/PaymentMethodCard';
import PaymentMethodsSkeleton from '@/pages/PaymentMethods/components/PaymentMethodsSkeleton';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { PAYMENT_TYPE_GROUPS } from '@/utils/entities/paymentMethod';

interface PaymentMethodsPageContentProps {
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

// Display order: Credit → Banking → Digital & Cash
const DISPLAY_GROUP_KEYS = ['cards', 'banking', 'digitalAndCash'];

const DISPLAY_GROUPS = DISPLAY_GROUP_KEYS.map(key =>
  PAYMENT_TYPE_GROUPS.find(g => g.labelKey.includes(key))
).filter((g): g is NonNullable<typeof g> => g != null);

const PaymentMethodsPageContent = ({ selectPaymentMethod }: PaymentMethodsPageContentProps) => {
  const { t } = useTranslation('paymentMethods');
  const { paymentMethods, isLoading, error, refetch } = usePaymentMethods();

  if (error) {
    return <EntityError entityName={'paymentMethods'} refetch={refetch} />;
  }

  if (isLoading) {
    return <PaymentMethodsSkeleton />;
  }

  if (!paymentMethods.length) {
    return <EntityEmpty entityName={'paymentMethods'} icon={CreditCardIcon} />;
  }

  return (
    <Column spacing={4}>
      {DISPLAY_GROUPS.map(group => {
        const groupMethods = paymentMethods.filter(pm => group.types.includes(pm.type));

        if (!groupMethods.length) {
          return null;
        }

        return (
          <Column spacing={1.5} key={group.labelKey}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: 1.2,
                color: 'text.secondary',
                lineHeight: 1,
              }}
            >
              {t(group.labelKey)}
            </Typography>
            <Grid container spacing={2}>
              {groupMethods.map(paymentMethod => (
                <Grid key={paymentMethod._id} size={{ xs: 12, sm: 4, md: 3 }}>
                  <PaymentMethodCard
                    paymentMethod={paymentMethod}
                    selectPaymentMethod={selectPaymentMethod}
                  />
                </Grid>
              ))}
            </Grid>
          </Column>
        );
      })}
    </Column>
  );
};

export default PaymentMethodsPageContent;
