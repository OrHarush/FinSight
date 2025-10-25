import RHFSelect from '@/components/inputs/RHFSelect';
import Column from '@/components/layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/layout/Containers/Row';
import { InputLabel, Skeleton } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import CategoriesSelect from '@/components/categories/CategoriesSelect';
import { useCategories } from '@/hooks/useCategories';
import AccountSelect from '@/components/accounts/AccountSelect';
import TransactionTypeSelector from '@/components/dialogs/TransactionDialogs/TransactionTypeSelector';
import { useIsMobile } from '@/hooks/useIsMobile';

const recurrenceOptions = ['None', 'Monthly', 'Yearly'];

const TransactionForm = () => {
  const { categories, isLoading } = useCategories();
  const { control } = useFormContext<TransactionFormValues>();
  const isMobile = useIsMobile();

  const transactionType = useWatch({ control, name: 'type' });
  const recurrence = useWatch({ control, name: 'recurrence' });

  const filteredCategories = categories.filter(
    c => c.type.toLowerCase() === transactionType?.toLowerCase()
  );

  return (
    <Column spacing={isMobile ? 1 : 2} height={isMobile ? '432px' : '460px'}>
      <TransactionTypeSelector />
      {transactionType !== 'Transfer' && <TextInput name="name" label="Name" required />}
      <Row spacing={2}>
        <TextInput name="amount" label="Amount" type="number" min={1} required />
        <RHFSelect
          name="recurrence"
          label="Recurrence"
          required
          fullWidth
          options={recurrenceOptions.map(option => ({
            label: option,
            value: option,
          }))}
        />
      </Row>
      {recurrence == 'None' ? (
        <TextInput name="date" label="Date" type={'date'} sx={{ width: '180px' }} />
      ) : (
        <Row spacing={2}>
          <TextInput name="startDate" label="Start Date" type={'date'} sx={{ width: '180px' }} />
          <TextInput name="endDate" label="End Date" type={'month'} sx={{ width: '180px' }} />
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
        <>
          <AccountSelect name={'fromAccount'} label={'From Account'} />
          <AccountSelect name={'toAccount'} label={'To Account'} />
        </>
      ) : (
        <AccountSelect label={'Account'} />
      )}
    </Column>
  );
};

export default TransactionForm;
