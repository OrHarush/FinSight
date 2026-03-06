import Column from '@/components/shared/layout/containers/Column';
import { Grid } from '@mui/material';
import TransactionTypeSelector from '@/pages/Transactions/components/TransactionForm/TransactionTypeSelector';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import PaymentSection from '@/pages/Transactions/components/TransactionForm/PaymentSection';
import AccountSection from '@/pages/Transactions/components/TransactionForm/AccountSection';
import ClassificationSection from '@/pages/Transactions/components/TransactionForm/ClassificationSection';
import ScheduleSection from '@/pages/Transactions/components/TransactionForm/ScheduleSection';
import TransactionBaseDetails from '@/pages/Transactions/components/TransactionForm/TransactionBaseDetails';

const TransactionForm = ({ disableTypeSelector = false }: { disableTypeSelector?: boolean }) => {
  const isMobile = useIsMobile();

  return (
    <Column spacing={4} height={isMobile ? '100%' : '440px'}>
      <TransactionTypeSelector disabled={disableTypeSelector} />
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
