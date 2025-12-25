import RHFSelect from '@/components/inputs/RHFSelect';
import Column from '@/components/layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/layout/Containers/Row';
import { Checkbox, FormControlLabel, Grid, InputLabel, Skeleton } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import CategoriesSelect from '@/components/categories/CategoriesSelect';
import { useCategories } from '@/hooks/entities/useCategories';
import AccountSelect from '@/components/accounts/AccountSelect';
import TransactionTypeSelector from '@/components/dialogs/TransactionDialogs/TransactionTypeSelector';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useTranslation } from 'react-i18next';

type RecurrenceValue = 'None' | 'Monthly' | 'Yearly';

const TransactionForm = () => {
  const { t } = useTranslation('transactions');
  const { categories, isLoading } = useCategories();
  const { paymentMethods } = usePaymentMethods();
  const { control } = useFormContext<TransactionFormValues>();
  const isMobile = useIsMobile();
  const recurrenceOptions: { label: string; value: RecurrenceValue }[] = [
    { value: 'None', label: t('recurrence.none') },
    { value: 'Monthly', label: t('recurrence.monthly') },
    { value: 'Yearly', label: t('recurrence.yearly') },
  ];

  const transactionType = useWatch({ control, name: 'type' });
  const recurrence = useWatch({ control, name: 'recurrence' });
  const paymentMethodId = useWatch({ control, name: 'paymentMethod' });
  const paymentMethod = paymentMethods.find(paymentMethod => paymentMethod._id === paymentMethodId);

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  console.log('=');
  console.log(t('recurrence.none'));
  console.log(recurrence);
  return (
    <Column spacing={isMobile ? 1 : 2} height={isMobile ? '548px' : '590px'}>
      <TransactionTypeSelector />
      {transactionType !== 'Transfer' && (
        <TextInput name="name" label={t('fields.name')} required />
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextInput name="amount" label={t('fields.amount')} type="number" min={1} required />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <RHFSelect
            name="recurrence"
            label={t('fields.recurrence')}
            required
            options={recurrenceOptions.map(option => ({
              label: option.label,
              value: option.value,
            }))}
          />
        </Grid>
      </Grid>
      {recurrence == 'None' ? (
        <TextInput name="date" label={t('fields.date')} type={'date'} sx={{ width: '50%' }} />
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextInput name="startDate" label={t('fields.startDate')} type={'date'} fullWidth />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextInput name="endDate" label={t('fields.endDate')} type={'month'} fullWidth />
          </Grid>
        </Grid>
      )}
      {transactionType !== 'Transfer' && !isLoading ? (
        <CategoriesSelect filteredCategories={filteredCategories} />
      ) : transactionType !== 'Transfer' ? (
        <Column spacing={0.5}>
          <InputLabel>Category</InputLabel>
          <Skeleton variant="rectangular" width={'120px'} height={40} sx={{ borderRadius: 1 }} />
        </Column>
      ) : null}
      {transactionType === 'Transfer' ? (
        <Row spacing={2}>
          <AccountSelect name={'fromAccount'} label={t('fields.fromAccount')} />
          <AccountSelect name={'toAccount'} label={t('fields.toAccount')} />
        </Row>
      ) : (
        <AccountSelect label={t('fields.account')} />
      )}
      <Column spacing={1}>
        <RHFSelect
          name={'paymentMethod'}
          label={t('fields.paymentMethod')}
          required
          options={paymentMethods.map(paymentMethod => ({
            label: paymentMethod.name,
            value: paymentMethod._id,
          }))}
        />
        {paymentMethod?.type !== 'Credit' && (
          <FormControlLabel
            control={
              <Controller
                name="belongToPreviousMonth"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label={t('fields.countTowardPreviousMonth')}
          />
        )}
      </Column>
    </Column>
  );
};

export default TransactionForm;
