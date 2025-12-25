import Column from '@/components/layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import { Grid } from '@mui/material';
import IconPickerField from '@/components/dialogs/IconPicker/IconPickerButton';
import { bankAccountIcons } from '@/constants/BankAccountIcons';
import { useTranslation } from 'react-i18next';

const AccountForm = () => {
  const { t } = useTranslation('accounts');

  return (
    <Column spacing={2}>
      <TextInput name="name" label={t('fields.name')} required />
      <TextInput name="balance" label={t('fields.balance')} type="number" required />
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
            required
          />
        </Grid>
      </Grid>
      <IconPickerField
        icons={bankAccountIcons}
        defaultIcon="AccountBalance"
        label={t('fields.icon')}
      />
    </Column>
  );
};

export default AccountForm;
