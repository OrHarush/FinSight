import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MultiSelectChip from '@/components/shared/inputs/MultiSelectChip';
import { MultiSelectChipItem } from '@/components/shared/inputs/MultiSelectChip/MultiSelectChipList';
import Row from '@/components/shared/layout/containers/Row';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { getAccountDisplayName } from '@/utils/entities/account';

interface AccountFilterProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const AccountFilter = ({ selectedIds, onChange }: AccountFilterProps) => {
  const { t } = useTranslation('transactions');
  const { t: tAccounts } = useTranslation('accounts');
  const { accounts } = useAccounts();

  const accountsOptions: MultiSelectChipItem[] = accounts.map(account => {
    const AccountIcon = (account.icon && bankAccountIconMap[account.icon]) || AccountBalanceIcon;

    return {
      id: account._id,
      renderRow: () => (
        <Row spacing={1.5} alignItems="center">
          <AccountIcon sx={{ fontSize: '20px', color: 'text.secondary' }} />
          <Typography variant="body2">{getAccountDisplayName(account, tAccounts)}</Typography>
        </Row>
      ),
    };
  });

  return (
    <MultiSelectChip
      label={
        selectedIds.length === 0
          ? t('filters.allAccounts')
          : t('filters.selectedAccounts', { count: selectedIds.length })
      }
      icon={<AccountBalanceIcon />}
      selectedIds={selectedIds}
      onChange={onChange}
      items={accountsOptions}
    />
  );
};

export default AccountFilter;
