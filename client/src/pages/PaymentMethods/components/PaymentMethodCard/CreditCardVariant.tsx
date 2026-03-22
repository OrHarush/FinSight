import { Card, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import MenuTriggerButton from '@/components/shared/ui/MenuTriggerButton';
import CardNetworkIcon from '@/pages/PaymentMethods/components/PaymentMethodCard/CardNetworkIcon';
import PrimaryBadge from '@/pages/PaymentMethods/components/PaymentMethodCard/PrimaryBadge';
import { getCardStyle } from '@/pages/PaymentMethods/components/PaymentMethodCard/styles';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { PAYMENT_TYPE_LOCALE_KEY } from '@/utils/paymentMethodUtils';

interface CreditCardVariantProps {
  paymentMethod: PaymentMethodDto;
  onCardClick: () => void;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}

const CreditCardVariant = ({ paymentMethod, onCardClick, onMenuOpen }: CreditCardVariantProps) => {
  const { t } = useTranslation('paymentMethods');
  const typeKey = PAYMENT_TYPE_LOCALE_KEY[paymentMethod.type];

  return (
    <Card onClick={onCardClick} sx={{ ...getCardStyle(paymentMethod.isPrimary) }}>
      <Column sx={{ height: '100%', px: 1.5, py: 1 }} justifyContent="space-between">
        <Row justifyContent="space-between" alignItems="center">
          <Column spacing={1}>
            <Row spacing={1} alignItems="center">
              <Chip
                label={t(`types.${typeKey}`)}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255,255,255,0.13)',
                  color: 'rgba(255,255,255,0.88)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  '& .MuiChip-label': { px: 0.875 },
                }}
              />
              {paymentMethod.isPrimary && <PrimaryBadge />}
            </Row>
            <Column>
              <Typography
                noWrap
                sx={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}
              >
                {paymentMethod.name}
              </Typography>
              {paymentMethod.billingDay && (
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
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
            sx={{
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.72)',
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
