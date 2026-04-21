import { TransactionFormValues } from '@lyra/shared';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Box, Grid } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AccountSelect from '@/components/features/accounts/AccountSelect';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface AccountsSectionProps {
  smSize?: number;
  xsSize?: number;
}

const AccountsSection = ({ smSize = 6, xsSize = 12 }: AccountsSectionProps) => {
  const { t } = useTranslation('transactions');
  const isMobile = useIsMobile();

  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });

  if (transactionType !== 'Transfer') {
    return (
      <Grid size={{ xs: xsSize, sm: smSize }}>
        <AccountSelect label={t('fields.account')} />
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12 }}>
      <ResponsiveRow spacing={1}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <AccountSelect name="fromAccount" label={t('fields.fromAccount')} />
        </Box>
        {!isMobile && (
          <Box>
            <SwapHorizIcon sx={{ color: 'text.secondary', marginTop: '4px' }} />
          </Box>
        )}
        <Box sx={{ flex: 1, width: '100%' }}>
          <AccountSelect name="toAccount" label={t('fields.toAccount')} />
        </Box>
      </ResponsiveRow>
    </Grid>
  );
};

export default AccountsSection;
