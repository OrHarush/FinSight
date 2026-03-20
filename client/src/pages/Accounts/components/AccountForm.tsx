import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { CURRENCIES } from '@/constants/currencies';
import AccountIconPicker from '@/pages/Accounts/components/AccountIconPicker';

const AccountForm = () => {
  const { t } = useTranslation('accounts');

  return (
    <Column spacing={2}>
      <Row spacing={2} alignItems="center">
        <AccountIconPicker />
        <Box flex={1}>
          <TextInput name="name" label={t('fields.name')} />
        </Box>
      </Row>
      <Row spacing={2}>
        <Box flex={1}>
          <TextInput name="balance" label={t('fields.balance')} type="number" />
        </Box>
        <Box flex={1}>
          <RHFSelect
            name="currency"
            label={t('fields.currency')}
            options={CURRENCIES.map(c => ({ value: c.value, label: c.label }))}
          />
        </Box>
      </Row>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextInput name="institution" label={t('fields.institution')} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextInput
            name="accountNumber"
            label={t('fields.accountNumber')}
            slotProps={{
              htmlInput: {
                maxLength: 20,
                inputMode: 'numeric',
              },
            }}
          />
        </Grid>
      </Grid>
    </Column>
  );
};

export default AccountForm;
