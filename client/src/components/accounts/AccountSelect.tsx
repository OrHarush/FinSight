import RHFSelect from '@/components/inputs/RHFSelect';
import { useAccounts } from '@/hooks/useAccounts';
import AccountMenuItem from '@/components/accounts/AccountMenuItem';

interface AccountSelectProps {
  name?: string;
  label?: string;
}

const AccountSelect = ({ name = 'account', label = '' }: AccountSelectProps) => {
  const { accounts } = useAccounts();

  return (
    <RHFSelect
      name={name}
      label={label}
      required
      options={accounts.map(account => ({
        label: account.name,
        value: account._id,
        design: <AccountMenuItem account={account} />,
      }))}
    />
  );
};

export default AccountSelect;
