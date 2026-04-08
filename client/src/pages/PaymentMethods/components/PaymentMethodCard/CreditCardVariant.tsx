import { Card, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import MenuTriggerButton from '@/components/shared/ui/MenuTriggerButton';
import CardNetworkIcon from '@/pages/PaymentMethods/components/PaymentMethodCard/CardNetworkIcon';
import PrimaryBadge from '@/pages/PaymentMethods/components/PaymentMethodCard/PrimaryBadge';
import { getCardStyle } from '@/pages/PaymentMethods/components/PaymentMethodCard/styles';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { getPaymentMethodDisplayName, PAYMENT_TYPE_LOCALE_KEY } from '@/utils/entities/paymentMethod';

interface CreditCardVariantProps {
  paymentMethod: PaymentMethodDto;
  onCardClick: () => void;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}

const CreditCardVariant = ({ paymentMethod, onCardClick, onMenuOpen }: CreditCardVariantProps) => {
  const { t } = useTranslation('paymentMethods');
  const typeKey = PAYMENT_TYPE_LOCALE_KEY[paymentMethod.type];
  const displayName = getPaymentMethodDisplayName(paymentMethod, t);

  return (
    <Card onClick={onCardClick} sx={{ ...getCardStyle(paymentMethod.isPrimary) }}>
      <Column sx={{ height: '100%', px: 1.5, py: 1 }} justifyContent="space-between">
        <Row justifyContent="space-between" alignItems="center">
          <Column spacing={1}>
            <Row spacing={1} alignItems="center">
              <Chip
                label={t(`types.${typeKey}`)}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 500, alignSelf: 'flex-start' }}
              />

              {paymentMethod.isPrimary && <PrimaryBadge />}
            </Row>
            <Column>
              <Typography noWrap sx={{ fontSize: '1rem', fontWeight: 700 }}>
                {displayName}
              </Typography>
              {paymentMethod.billingDay && (
                <Typography color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {t('fields.billingDay')}: {String(paymentMethod.billingDay).padStart(2, '0')}
                </Typography>
              )}
            </Column>
          </Column>
          <MenuTriggerButton openMenu={onMenuOpen} />
        </Row>
        <Row justifyContent="space-between" alignItems="center">
          <Typography
            dir="ltr"
            color="text.secondary"
            sx={{
              fontSize: '0.72rem',
              letterSpacing: 1.5,
              fontFamily: 'monospace',
            }}
          >
            •••• •••• •••• {paymentMethod.lastFourDigits ?? '0000'}
          </Typography>
          <CardNetworkIcon name={paymentMethod.name} />
        </Row>
      </Column>
    </Card>
  );
};

export default CreditCardVariant;
