import { Box, Card, Chip, Typography } from '@mui/material';
import creditCardChip from '@/assets/creditCardChip.png';
import { PaymentMethodDto } from '@/types/PaymentMethod';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { useTranslation } from 'react-i18next';
import paypalBg from '@/assets/paypal.png';
import bankBg from '@/assets/bankBackground.png';

interface Props {
  paymentMethod: PaymentMethodDto;
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

const PaymentMethodCard = ({ paymentMethod, selectPaymentMethod }: Props) => {
  const { t } = useTranslation('paymentMethods');
  const isCardPayment = paymentMethod.type === 'Credit' || paymentMethod.type === 'Debit';

  return (
    <Card
      onClick={() => selectPaymentMethod(paymentMethod)}
      sx={{
        position: 'relative',
        height: '216px',
        width: '343px',
        minWidth: '300px',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
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
      <Column
        padding={2}
        spacing={2}
        sx={{ height: '100%', position: 'relative', zIndex: 1 }}
        justifyContent={'space-between'}
      >
        <Row justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {paymentMethod.name}
          </Typography>
          <Chip
            label={paymentMethod.type}
            size="small"
            sx={{
              height: 28,
              padding: 1,
              fontSize: '1rem',
              fontWeight: 500,
            }}
            variant="outlined"
          />
        </Row>
        {isCardPayment && (
          <>
            <img src={creditCardChip} alt="Credit Card Chip" width={64} />
            <Typography
              variant="h5"
              sx={{
                letterSpacing: 3,
                fontWeight: 500,
              }}
            >
              •••• •••• •••• {paymentMethod.last4 ?? '0000'}
            </Typography>
          </>
        )}
        <Typography alignSelf={'center'} justifySelf={'flex-end'}>
          {t('fields.billingDay')}:{' '}
          {paymentMethod.billingDay
            ? paymentMethod.billingDay?.toString().padStart(2, '0')
            : ' Same day'}
        </Typography>
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
    </Card>
  );
};

export default PaymentMethodCard;
