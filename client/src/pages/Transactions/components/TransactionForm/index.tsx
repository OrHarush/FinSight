import Column from '@/components/shared/layout/containers/Column';
import { Box, Grid, InputAdornment } from '@mui/material';
import TransactionTypeSelector from '@/pages/Transactions/components/TransactionForm/TransactionTypeSelector';
import PaymentSection from '@/pages/Transactions/components/TransactionForm/PaymentSection';
import AccountSection from '@/pages/Transactions/components/TransactionForm/AccountSection';
import ClassificationSection from '@/pages/Transactions/components/TransactionForm/ClassificationSection';
import ScheduleSection from '@/pages/Transactions/components/TransactionForm/ScheduleSection';
import TransactionBaseDetails from '@/pages/Transactions/components/TransactionForm/TransactionBaseDetails';
import TextInput from '@/components/shared/inputs/TextInput';
import { useTranslation } from 'react-i18next';
import RecurrenceSelect from '@/pages/Transactions/components/TransactionForm/RecurrenceSelect';
import AdvancedSettingsSection from '@/pages/Transactions/components/TransactionForm/AdvancedSettingsSection';
import PreviousMonthCheckboxRow from '@/pages/Transactions/components/TransactionForm/PreviousMonthCheckboxRow';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';

const TransactionForm = ({ disableTypeSelector = false }: { disableTypeSelector?: boolean }) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const recurrence = useWatch({ control, name: 'recurrence' });
  const transactionType = useWatch({ control, name: 'type' });

  const isRecurring = recurrence !== 'None';
  const isTransfer = transactionType === 'Transfer';

  return (
    <Column spacing={2} height="auto">
      <TransactionTypeSelector disabled={disableTypeSelector} />
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <TextInput
          name="amount"
          label={t('fields.amount')}
          type="number"
          required
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₪</InputAdornment>,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-input': {
              py: 1,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            },
            '& .MuiInputAdornment-root': {
              color: 'text.secondary',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            },
          }}
        />
      </Box>
      <Grid container spacing={1.5}>
        {!isTransfer && (
          <>
            <TransactionBaseDetails />
            <ClassificationSection isFullWidth={!isRecurring} />
            <AdvancedSettingsSection />
          </>
        )}
        {isTransfer && (
          <>
            <AccountSection />
            <PaymentSection />
            <RecurrenceSelect />
            <ScheduleSection isTransfer />
          </>
        )}
      </Grid>
      <PreviousMonthCheckboxRow />
    </Column>
  );
};

export default TransactionForm;
