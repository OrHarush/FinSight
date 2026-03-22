import { useState } from 'react';

import CreditCardVariant from '@/pages/PaymentMethods/components/PaymentMethodCard/CreditCardVariant';
import FlatCardVariant from '@/pages/PaymentMethods/components/PaymentMethodCard/FlatCardVariant';
import PaymentMethodCardMenu from '@/pages/PaymentMethods/components/PaymentMethodCard/PaymentMethodCardMenu';
import { PaymentMethodDto } from '@/types/PaymentMethod';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodDto;
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

const CREDIT_CARD_TYPES = ['Credit Card', 'Debit'] as const;

const PaymentMethodCard = ({ paymentMethod, selectPaymentMethod }: PaymentMethodCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const isCreditCardVariant = (CREDIT_CARD_TYPES as readonly string[]).includes(paymentMethod.type);

  return (
    <>
      {isCreditCardVariant ? (
        <CreditCardVariant
          paymentMethod={paymentMethod}
          onCardClick={() => selectPaymentMethod(paymentMethod)}
          onMenuOpen={handleMenuOpen}
        />
      ) : (
        <FlatCardVariant
          paymentMethod={paymentMethod}
          onCardClick={() => selectPaymentMethod(paymentMethod)}
          onMenuOpen={handleMenuOpen}
        />
      )}
      <PaymentMethodCardMenu
        paymentMethod={paymentMethod}
        open={open}
        handleMenuClose={handleMenuClose}
        anchorEl={anchorEl}
      />
    </>
  );
};

export default PaymentMethodCard;
