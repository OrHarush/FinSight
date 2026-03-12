import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TextInput from '@/components/shared/inputs/TextInput';
import AccountIconPicker from '@/pages/Accounts/components/AccountIconPicker';
import RHFSelect from '@/components/shared/inputs/RHFSelect';
import { CURRENCIES } from '@/constants/currencies';

const AccountForm = () => {
  const { t } = useTranslation('accounts');

  return (
    <Column spacing={2}>
      <Row spacing={2} alignItems="center">
        <AccountIconPicker />
        <Box flex={1}>
          <TextInput name="name" label={t('fields.name')} required />
        </Box>
      </Row>
      <Row spacing={2}>
        <Box flex={1}>
          <TextInput name="balance" label={t('fields.balance')} type="number" required />
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
            rules={{
              pattern: {
                value: /^\d{4}$/,
                message: t('validation.accountNumberFormat'),
              },
            }}
            slotProps={{
              htmlInput: {
                maxLength: 4,
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
