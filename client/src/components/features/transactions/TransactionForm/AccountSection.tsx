import AccountSelect from '@/components/features/accounts/AccountSelect';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';

const AccountsSection = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });

  return transactionType === 'Transfer' ? (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <AccountSelect name="fromAccount" label={t('fields.fromAccount')} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <AccountSelect name="toAccount" label={t('fields.toAccount')} />
      </Grid>
    </>
  ) : (
    <Grid size={{ xs: 12, sm: 6 }}>
      <AccountSelect label={t('fields.account')} />
    </Grid>
  );
};

export default AccountsSection;
