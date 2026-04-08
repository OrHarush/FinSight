import { Card, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import MenuTriggerButton from '@/components/shared/ui/MenuTriggerButton';
import FlatCardTypeIcon from '@/pages/PaymentMethods/components/PaymentMethodCard/FlatCardTypeIcon';
import PrimaryBadge from '@/pages/PaymentMethods/components/PaymentMethodCard/PrimaryBadge';
import { getCardStyle } from '@/pages/PaymentMethods/components/PaymentMethodCard/styles';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import { getPaymentMethodDisplayName, PAYMENT_TYPE_LOCALE_KEY } from '@/utils/entities/paymentMethod';

interface FlatCardVariantProps {
  paymentMethod: PaymentMethodDto;
  onCardClick: () => void;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}

const FlatCardVariant = ({ paymentMethod, onCardClick, onMenuOpen }: FlatCardVariantProps) => {
  const { t } = useTranslation('paymentMethods');
  const typeKey = PAYMENT_TYPE_LOCALE_KEY[paymentMethod.type];
  const typeLabel = t(`types.${typeKey}`);
  const displayName = getPaymentMethodDisplayName(paymentMethod, t);
  const hasName = !!paymentMethod.name || !!paymentMethod.key;

  return (
    <Card
      onClick={onCardClick}
      sx={{ ...getCardStyle(paymentMethod.isPrimary), position: 'relative' }}
    >
      <MenuTriggerButton openMenu={onMenuOpen} />
      <Row sx={{ px: 2, py: 1.25, height: '100%' }} alignItems="center" spacing={1.5}>
        <FlatCardTypeIcon type={paymentMethod.type} />
        <Column spacing={0} sx={{ flex: 1, minWidth: 0 }}>
          <Row alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {hasName ? displayName : typeLabel}
            </Typography>
            {paymentMethod.isPrimary && <PrimaryBadge />}
          </Row>
          {hasName ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {typeLabel}
            </Typography>
          ) : (
            <Chip
              label={typeLabel}
              size="small"
              variant="outlined"
              sx={{ height: 18, fontSize: '0.6rem', fontWeight: 500, alignSelf: 'flex-start' }}
            />
          )}
        </Column>
      </Row>
    </Card>
  );
};
export default FlatCardVariant;
