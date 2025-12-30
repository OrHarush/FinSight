import Column from '@/components/shared/layout/containers/Column';
import { Grid } from '@mui/material';
import TransactionTypeSelector from '@/components/features/transactions/TransactionTypeSelector';
import { useIsMobile } from '@/hooks/useIsMobile';
import PaymentSection from '@/components/features/transactions/TransactionForm/PaymentSection';
import AccountSection from '@/components/features/transactions/TransactionForm/AccountSection';
import ClassificationSection from '@/components/features/transactions/TransactionForm/ClassificationSection';
import ScheduleSection from '@/components/features/transactions/TransactionForm/ScheduleSection';
import TransactionBaseDetails from '@/components/features/transactions/TransactionForm/TransactionBaseDetails';

const TransactionForm = () => {
  const isMobile = useIsMobile();

  return (
    <Column spacing={4} height={isMobile ? '100%' : '440px'}>
      <TransactionTypeSelector />
      <Grid container spacing={isMobile ? 1 : 8}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Column spacing={isMobile ? 1 : 4}>
            <TransactionBaseDetails />
            <ScheduleSection />
          </Column>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} spacing={2}>
          <Grid container spacing={2}>
            <ClassificationSection />
            <AccountSection />
            <PaymentSection />
          </Grid>
        </Grid>
      </Grid>
    </Column>
  );
};

export default TransactionForm;
