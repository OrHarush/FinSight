import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MultiSelectChip, {
  MultiSelectChipItem,
} from '@/components/shared/inputs/MultiSelectChip';
import Row from '@/components/shared/layout/containers/Row';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { getFilterChipLabel } from '@/utils/transactionUtils';

interface AccountFilterProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const AccountFilter = ({ selectedIds, onChange }: AccountFilterProps) => {
  const { t } = useTranslation('transactions');
  const { accounts } = useAccounts();

  const items: MultiSelectChipItem[] = accounts.map(account => ({
    id: account._id,
    renderRow: () => (
      <Row spacing={1.5} alignItems="center">
        <AccountBalanceIcon sx={{ fontSize: '20px', color: 'text.secondary' }} />
        <Typography variant="body2">{account.name}</Typography>
      </Row>
    ),
  }));

  return (
    <MultiSelectChip
      label={getFilterChipLabel(selectedIds.length, t('filters.allAccounts'), t, 'filters.selectedAccounts')}
      selectedIds={selectedIds}
      onChange={onChange}
      items={items}
    />
  );
};

export default AccountFilter;
