import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Grid } from '@mui/material';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import PaymentMethodCard from '@/pages/PaymentMethods/components/PaymentMethodCard';
import PaymentMethodsSkeleton from '@/pages/PaymentMethods/components/PaymentMethodsSkeleton';
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
    return <PaymentMethodsSkeleton />;
  }

  if (!paymentMethods.length) {
    return <EntityEmpty entityName={'paymentMethods'} icon={CreditCardIcon} />;
  }

  return (
    <Grid container spacing={3}>
      {paymentMethods?.map(paymentMethod => (
        <Grid
          key={paymentMethod._id}
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
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
