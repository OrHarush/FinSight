import Column from '@/components/layout/Containers/Column';
import { Grid } from '@mui/material';
import TransactionTypeSelector from '@/components/dialogs/TransactionDialogs/TransactionTypeSelector';
import { useIsMobile } from '@/hooks/useIsMobile';
import PaymentSection from '@/components/dialogs/TransactionDialogs/TransactionForm/PaymentSection';
import AccountSection from '@/components/dialogs/TransactionDialogs/TransactionForm/AccountSection';
import ClassificationSection from '@/components/dialogs/TransactionDialogs/TransactionForm/ClassificationSection';
import ScheduleSection from '@/components/dialogs/TransactionDialogs/TransactionForm/ScheduleSection';
import TransactionBaseDetails from '@/components/dialogs/TransactionDialogs/TransactionForm/TransactionBaseDetails';

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
