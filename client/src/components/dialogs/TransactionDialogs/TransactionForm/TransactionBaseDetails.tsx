import Column from '@/components/layout/Containers/Column';
import { useTranslation } from 'react-i18next';
import TextInput from '@/components/inputs/TextInput';
import AmountInput from '@/components/inputs/AmountInput';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';

const TransactionBaseDetails = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });

  return (
    <Column spacing={2}>
      {transactionType !== 'Transfer' && (
        <TextInput name="name" label={t('fields.name')} required />
      )}
      <AmountInput name="amount" label={t('fields.amount')} />
    </Column>
  );
};

export default TransactionBaseDetails;
