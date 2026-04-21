import AccountMenuItem from '@/components/features/accounts/AccountMenuItem';
import RHFSelect from '@/components/shared/inputs/RHFSelect';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useAccounts } from '@/hooks/entities/useAccounts';

interface AccountSelectProps {
  name?: string;
  label?: string;
}

const AccountSelect = ({ name = 'account', label = '' }: AccountSelectProps) => {
  const { accounts } = useAccounts();
  const isSmallScreen = useIsSmallScreen();

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
      sx={{
        '& .MuiSelect-select, & .MuiSelect-select .MuiTypography-root': {
          fontSize: isSmallScreen ? '0.875rem' : 'none',
        },
      }}
    />
  );
};

export default AccountSelect;
