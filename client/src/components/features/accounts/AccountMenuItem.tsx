import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StarIcon from '@mui/icons-material/Star';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';
import { AccountDto } from '@/types/Account';
import { getAccountDisplayName } from '@/utils/entities/account';

interface AccountMenuItemProps {
  account: AccountDto;
}

const AccountMenuItem = ({ account }: AccountMenuItemProps) => {
  const { t } = useTranslation('accounts');
  const AccountIcon = (account.icon && bankAccountIconMap[account.icon]) || AccountBalanceIcon;
  const displayName = getAccountDisplayName(account, t);

  return (
    <Row spacing={1} alignItems="center" width={'100%'}>
      <Row spacing={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
        <AccountIcon sx={{ flexShrink: 0 }} />
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </Typography>
      </Row>
      {account.isPrimary && <StarIcon sx={{ fontSize: '0.8rem', color: 'primary.main' }} />}
    </Row>
  );
};

export default AccountMenuItem;
