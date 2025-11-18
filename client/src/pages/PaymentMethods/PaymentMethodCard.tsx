import { Card, Box, Typography } from '@mui/material';
import creditCardChip from '@/assets/creditCardChip.png';
import { PaymentMethodDto } from '@/types/PaymentMethod';

interface Props {
  paymentMethod: PaymentMethodDto;
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

const PaymentMethodCard = ({ paymentMethod, selectPaymentMethod }: Props) => (
  <Card
    onClick={() => selectPaymentMethod(paymentMethod)}
    sx={{
      borderRadius: 3,
      color: 'white',
      position: 'relative',
      height: '216px',
      width: '343px',
      overflow: 'hidden',
      padding: 3,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
        transform: 'translateY(-2px)',
        borderColor: 'primary.main',
      },
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
      {paymentMethod.name}
    </Typography>
    <img src={creditCardChip} alt={'Credit Card Chip'} width={64} />
    <Typography
      variant="h5"
      sx={{
        letterSpacing: 3,
        mt: 1,
        mb: 3,
        fontWeight: 500,
      }}
    >
      •••• •••• •••• {paymentMethod.last4 ?? '0000'}
    </Typography>
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
  </Card>
);

export default PaymentMethodCard;
