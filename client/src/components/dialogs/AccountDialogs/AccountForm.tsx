import Column from '@/components/layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/layout/Containers/Row';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { Controller, useFormContext } from 'react-hook-form';
import { AccountFormValues } from '@/types/Account';
import IconPickerField from '@/components/dialogs/IconPicker/IconPickerButton';
import { bankAccountIcons } from '@/constants/BankAccountIcons';
import { useTranslation } from 'react-i18next';

const AccountForm = () => {
  const { t } = useTranslation('accounts');
  const { accounts } = useAccounts();
  const { control } = useFormContext<AccountFormValues>();

  const hasAccounts = accounts.length > 0;

  return (
    <Column spacing={2}>
      <TextInput name="name" label={t('fields.name')} required />
      <TextInput name="balance" label={t('fields.balance')} type="number" required />
      <Row spacing={2}>
        <TextInput name="institution" label={t('fields.institution')} />
        <TextInput name="accountNumber" label={t('fields.accountNumber')} type="number" required />
      </Row>
      <IconPickerField
        icons={bankAccountIcons}
        defaultIcon="AccountBalance"
        label={t('fields.icon')}
      />
      <FormControlLabel
        control={
          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value || !hasAccounts}
                onChange={e => field.onChange(e.target.checked)}
                disabled={!hasAccounts}
              />
            )}
          />
        }
        label={t('fields.isPrimary')}
      />
    </Column>
  );
};

export default AccountForm;
