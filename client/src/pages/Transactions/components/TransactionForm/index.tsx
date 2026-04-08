import { TransactionFormValues } from '@lyra/shared';
import { Box, Divider, Grid, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import DayDateSelector from '@/components/shared/ui/DayDateSelector';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import AccountSection from '@/pages/Transactions/components/TransactionForm/AccountSection';
import AdvancedSettingsSection from '@/pages/Transactions/components/TransactionForm/AdvancedSettingsSection';
import ClassificationSection from '@/pages/Transactions/components/TransactionForm/ClassificationSection';
import PaymentSection from '@/pages/Transactions/components/TransactionForm/PaymentSection';
import PreviousMonthCheckboxRow from '@/pages/Transactions/components/TransactionForm/PreviousMonthCheckboxRow';
import RecurrenceSelect from '@/pages/Transactions/components/TransactionForm/RecurrenceSelect';
import ScheduleSection from '@/pages/Transactions/components/TransactionForm/ScheduleSection';
import TransactionBaseDetails from '@/pages/Transactions/components/TransactionForm/TransactionBaseDetails';
import TransactionTypeSelector from '@/pages/Transactions/components/TransactionForm/TransactionTypeSelector';

const amountBoxSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};

const amountInputSx = {
  '& .MuiOutlinedInput-root': { height: '48px' },
  '& .MuiOutlinedInput-input': {
    py: 1,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: { xs: '2rem' },
  },
  '& .MuiInputAdornment-root': {
    color: 'text.secondary',
    fontSize: { xs: '1.2rem', sm: '1.5rem' },
  },
};

const TransactionForm = ({
  disableTypeSelector = false,
  hideRecurrence = false,
}: {
  disableTypeSelector?: boolean;
  hideRecurrence?: boolean;
}) => {
  const { t } = useTranslation('transactions');
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const recurrence = useWatch({ control, name: 'recurrence' });
  const transactionType = useWatch({ control, name: 'type' });
  const date = useWatch({ control, name: 'date' });
  const isSmallScreen = useIsSmallScreen();

  const isRecurring = !hideRecurrence && recurrence !== 'None';
  const isTransfer = transactionType === 'Transfer';

  const selectedDate = date && dayjs(date).isValid() ? dayjs(date) : dayjs();

  const handleDateChange = (newDate: dayjs.Dayjs) =>
    setValue('date', newDate.format('YYYY-MM-DD'), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

  const amountField = (
    <Box sx={amountBoxSx}>
      <TextInput
        name="amount"
        label={t('fields.amount')}
        type="number"
        placeholder={'0'}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">₪</InputAdornment>,
          },
        }}
        sx={amountInputSx}
      />
    </Box>
  );

  if (isSmallScreen) {
    return (
      <Column spacing={2} height="auto">
        <Row justifyContent={'center'}>
          {!isRecurring && <DayDateSelector value={selectedDate} onChange={handleDateChange} />}
        </Row>
        <TransactionTypeSelector disabled={disableTypeSelector} />
        {amountField}
        <Grid container spacing={1}>
          {!isTransfer && (
            <>
              <TransactionBaseDetails />
              <ClassificationSection />
              <AdvancedSettingsSection hideRecurrence={hideRecurrence} />
            </>
          )}
          {isTransfer && (
            <>
              <AccountSection />
              <AdvancedSettingsSection hideRecurrence={hideRecurrence} isTransfer={isTransfer} />
            </>
          )}
        </Grid>
        <PreviousMonthCheckboxRow />
      </Column>
    );
  }

  return (
    <Column spacing={2} height="auto">
      <Row justifyContent={'center'}>
        {!isRecurring && <DayDateSelector value={selectedDate} onChange={handleDateChange} />}
      </Row>
      <TransactionTypeSelector disabled={disableTypeSelector} />
      {amountField}
      <Grid container spacing={2}>
        {!isTransfer && (
          <>
            <TransactionBaseDetails />
            <ClassificationSection />
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>
            <AccountSection smSize={4} />
            <PaymentSection smSize={4} />
            {!hideRecurrence && <RecurrenceSelect smSize={4} />}
            {!hideRecurrence && <ScheduleSection />}
          </>
        )}
        {isTransfer && (
          <>
            <AccountSection />
            <PaymentSection smSize={!hideRecurrence ? 6 : 12} />
            {!hideRecurrence && <RecurrenceSelect smSize={6} />}
            {!hideRecurrence && <ScheduleSection />}
          </>
        )}
      </Grid>
      <PreviousMonthCheckboxRow />
      <TextInput
        name="note"
        label={t('fields.note')}
        placeholder={t('fields.notePlaceholder')}
        maxLength={200}
      />
    </Column>
  );
};

export default TransactionForm;
