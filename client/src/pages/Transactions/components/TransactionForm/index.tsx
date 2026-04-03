import { TransactionFormValues } from '@finsight/shared';
import { Box, Grid, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import DayDateSelector from '@/components/shared/ui/DayDateSelector';
import AccountSection from '@/pages/Transactions/components/TransactionForm/AccountSection';
import AdvancedSettingsSection from '@/pages/Transactions/components/TransactionForm/AdvancedSettingsSection';
import ClassificationSection from '@/pages/Transactions/components/TransactionForm/ClassificationSection';
import PreviousMonthCheckboxRow from '@/pages/Transactions/components/TransactionForm/PreviousMonthCheckboxRow';
import TransactionBaseDetails from '@/pages/Transactions/components/TransactionForm/TransactionBaseDetails';
import TransactionTypeSelector from '@/pages/Transactions/components/TransactionForm/TransactionTypeSelector';

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

  const isRecurring = !hideRecurrence && recurrence !== 'None';
  const isTransfer = transactionType === 'Transfer';

  const selectedDate = date && dayjs(date).isValid() ? dayjs(date) : dayjs();

  return (
    <Column spacing={2} height="auto">
      <Row justifyContent={'center'}>
        {!isRecurring && (
          <DayDateSelector
            value={selectedDate}
            onChange={newDate =>
              setValue('date', newDate.startOf('day').toISOString(), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        )}
      </Row>
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
          placeholder={'0'}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">₪</InputAdornment>,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '48px',
            },
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
          }}
        />
      </Box>
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
            {/*{!hideRecurrence && <ScheduleSection />}*/}
            <AdvancedSettingsSection hideRecurrence={hideRecurrence} isTransfer={isTransfer} />
            {/*<PaymentSection />*/}
            {/*{!hideRecurrence && <RecurrenceSelect />}*/}
          </>
        )}
      </Grid>
      <PreviousMonthCheckboxRow />
    </Column>
  );
};

export default TransactionForm;
