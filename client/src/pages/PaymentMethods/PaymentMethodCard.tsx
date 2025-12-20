import { Box, Chip, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import creditCardChip from '@/assets/creditCardChip.png';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PaymentMethodCardMenu from '@/pages/PaymentMethods/PaymentMethodCardMenu';
import PaymentMethodCardContainer from '@/pages/PaymentMethods/PaymentMethodCardContainer';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodDto;
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

const PaymentMethodCard = ({ paymentMethod, selectPaymentMethod }: PaymentMethodCardProps) => {
  const { t } = useTranslation('paymentMethods');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isCardPayment = paymentMethod.type === 'Credit' || paymentMethod.type === 'Debit';

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <PaymentMethodCardContainer
      paymentMethod={paymentMethod}
      selectPaymentMethod={selectPaymentMethod}
    >
      <Column
        padding={2}
        spacing={2}
        sx={{ height: '100%', position: 'relative', zIndex: 1 }}
        justifyContent={'space-between'}
      >
        <Row justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            {paymentMethod.name}
          </Typography>
          <Row spacing={1} alignItems="center">
            <Chip
              label={paymentMethod.type}
              size="small"
              variant="outlined"
              sx={{ height: 28, fontSize: '1rem', fontWeight: 500 }}
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Row>
        </Row>
        {isCardPayment && (
          <>
            <img src={creditCardChip} alt="Credit Card Chip" width={64} />
            <Typography variant="h5" letterSpacing={3} fontWeight={500}>
              •••• •••• •••• {paymentMethod.last4 ?? '0000'}
            </Typography>
          </>
        )}
        {paymentMethod.type === 'Credit' && paymentMethod.billingDay && (
          <Typography alignSelf="center">
            {`${t('fields.billingDay')}: ${paymentMethod.billingDay.toString().padStart(2, '0')}`}
          </Typography>
        )}
      </Column>
      {isCardPayment && (
        <Box
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            top: -60,
            right: -60,
          }}
        />
      )}
      <PaymentMethodCardMenu
        paymentMethod={paymentMethod}
        open={open}
        handleMenuClose={handleMenuClose}
        anchorEl={anchorEl}
      />
    </PaymentMethodCardContainer>
  );
};

export default PaymentMethodCard;
