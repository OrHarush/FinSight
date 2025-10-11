import Column from '@/components/Layout/Containers/Column';
import TextInput from '@/components/inputs/TextInput';
import Row from '@/components/Layout/Containers/Row';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useAccounts } from '@/hooks/useAccounts';
import { Controller, useFormContext } from 'react-hook-form';
import { AccountFormValues } from '@/types/Account';
import IconPickerField from '@/components/Dialogs/IconPicker/IconPickerButton';
import { bankAccountIcons } from '@/constants/BankAccountIcons';

const AccountForm = () => {
  const { accounts } = useAccounts();
  const { control } = useFormContext<AccountFormValues>();

  const hasAccounts = accounts.length > 0;

  return (
    <Column spacing={2}>
      <TextInput name="name" label="Name" required />
      <TextInput name="balance" label="Balance" type="number" required />
      <Row spacing={2}>
        <TextInput name="institution" label="Institution" />
        <TextInput name="accountNumber" label="Account Number" type="number" required />
      </Row>
      <IconPickerField icons={bankAccountIcons} defaultIcon={'AccountBalance'} />
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
        label="Set as Primary Account"
      />
    </Column>
  );
};

export default AccountForm;
