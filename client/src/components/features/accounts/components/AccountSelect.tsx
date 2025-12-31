import { useAccounts } from '@/hooks/entities/useAccounts';
import AccountMenuItem from '@/components/features/accounts/components/AccountMenuItem';
import RHFSelect from '@/components/shared/inputs/RHFSelect';

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
