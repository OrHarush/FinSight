import RHFSelect from '@/components/inputs/RHFSelect';
import Column from '@/components/layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/layout/Containers/Row';
import { Checkbox, FormControlLabel, InputLabel, Skeleton } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import CategoriesSelect from '@/components/categories/CategoriesSelect';
import { useCategories } from '@/hooks/entities/useCategories';
import AccountSelect from '@/components/accounts/AccountSelect';
import TransactionTypeSelector from '@/components/dialogs/TransactionDialogs/TransactionTypeSelector';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useTranslation } from 'react-i18next';

const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const TransactionForm = () => {
  const { t } = useTranslation('transactions');
  const { categories, isLoading } = useCategories();
  const { paymentMethods } = usePaymentMethods();
  const { control } = useFormContext<TransactionFormValues>();
  const isMobile = useIsMobile();

  const transactionType = useWatch({ control, name: 'type' });
  const recurrence = useWatch({ control, name: 'recurrence' });
  const paymentMethodId = useWatch({ control, name: 'paymentMethod' });
  const paymentMethod = paymentMethods.find(paymentMethod => paymentMethod._id === paymentMethodId);

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  return (
    <Column spacing={isMobile ? 1 : 2} height={isMobile ? '560px' : '580px'}>
      <TransactionTypeSelector />
      {transactionType !== 'Transfer' && <TextInput name="name" label="Name" required />}
      <Row spacing={2}>
        <TextInput name="amount" label={t('fields.amount')} type="number" min={1} required />
        {/**/}
        <RHFSelect
          name="recurrence"
          label="Recurrence"
          required
          options={recurrenceOptions.map(option => ({
            label: option,
            value: option,
          }))}
        />
      </Row>
      {recurrence == 'None' ? (
        <TextInput name="date" label={t('fields.date')} type={'date'} sx={{ width: '50%' }} />
      ) : (
        <Row spacing={2}>
          <TextInput name="startDate" label={t('fields.startDate')} type={'date'} fullWidth />
          <TextInput name="endDate" label={t('fields.endDate')} type={'month'} fullWidth />
        </Row>
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
      <Column>
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
            label={'Count toward previous month?'}
          />
        )}
      </Column>
    </Column>
  );
};

export default TransactionForm;
