import { Card } from '@mui/material';
import { ReactNode } from 'react';

import bankBg from '@/assets/bankBackground.webp';
import paypalBg from '@/assets/paypal.png';
import { PaymentMethodDto } from '@/types/PaymentMethod';

interface PaymentMethodCardContainerProps {
  paymentMethod: PaymentMethodDto;
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
  children?: ReactNode;
}

const PaymentMethodCardContainer = ({
  paymentMethod,
  selectPaymentMethod,
  children,
}: PaymentMethodCardContainerProps) => {
  const isCardPayment = paymentMethod.type === 'Credit Card' || paymentMethod.type === 'Debit';

  return (
    <Card
      onClick={() => selectPaymentMethod(paymentMethod)}
      sx={{
        position: 'relative',
        height: '216px',
        width: '343px',
        minWidth: '300px',
        aspectRatio: '343 / 216',

        borderRadius: 3,
        boxShadow: paymentMethod.isPrimary
          ? '0 4px 20px rgba(0,0,0,0.25), 0 0 0 2px rgba(124, 58, 237, 0.35)'
          : '0 4px 20px rgba(0,0,0,0.25)',
        border: paymentMethod.isPrimary ? '2px solid' : '1px solid',
        borderColor: paymentMethod.isPrimary ? 'primary.main' : 'divider',
        ...(!isCardPayment && {
          backgroundImage: paymentMethod.type === 'PayPal' ? `url(${paypalBg})` : `url(${bankBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          transform: 'translateY(-2px)',
          borderColor: 'primary.main',
        },
      }}
    >
      {children}
    </Card>
  );
};

export default PaymentMethodCardContainer;
