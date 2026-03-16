import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import AccountSelect from '@/components/features/accounts/AccountSelect';
import Row from '@/components/shared/layout/containers/Row';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const AccountsSection = () => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });

  if (transactionType !== 'Transfer') {
    return (
      <Grid size={{ xs: 12, sm: 6 }}>
        <AccountSelect label={t('fields.account')} />
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Row spacing={1}>
        <Box sx={{ flex: 1 }}>
          <AccountSelect name="fromAccount" label={t('fields.fromAccount')} />
        </Box>
        <Box>
          <SwapHorizIcon sx={{ color: 'text.secondary', marginTop: '32px' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <AccountSelect name="toAccount" label={t('fields.toAccount')} />
        </Box>
      </Row>
    </Grid>
  );
};

export default AccountsSection;
