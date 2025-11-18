import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { Card, CardContent, Grid, Skeleton } from '@mui/material';
import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import PaymentMethodCard from '@/pages/PaymentMethods/PaymentMethodCard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { PaymentMethodDto } from '@/types/PaymentMethod';

interface PaymentMethodsPageContentProps {
  selectPaymentMethod: (paymentMethod: PaymentMethodDto) => void;
}

const PaymentMethodsPageContent = ({ selectPaymentMethod }: PaymentMethodsPageContentProps) => {
  const { paymentMethods, isLoading, error, refetch } = usePaymentMethods();

  if (error) {
    return <EntityError entityName={'paymentMethods'} refetch={refetch} />;
  }

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3].map(i => (
          <Grid size={{ xs: 12 }} key={i}>
            <Card>
              <CardContent>
                <Skeleton width="40%" />
                <Skeleton width="30%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!paymentMethods.length) {
    return <EntityEmpty entityName={'paymentMethods'} icon={CreditCardIcon} />;
  }

  return (
    <Grid container spacing={3}>
      {paymentMethods?.map(paymentMethod => (
        <Grid key={paymentMethod._id} size={{ xs: 12, sm: 6, md: 4 }}>
          <PaymentMethodCard
            paymentMethod={paymentMethod}
            selectPaymentMethod={selectPaymentMethod}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PaymentMethodsPageContent;
