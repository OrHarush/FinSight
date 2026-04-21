import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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
      <Row spacing={0.5} sx={{ minWidth: 0, overflow: 'hidden' }} alignItems={'center'}>
        <AccountIcon sx={{ fontSize: '1rem', flexShrink: 0 }} />
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </Typography>
      </Row>
    </Row>
  );
};

export default AccountMenuItem;
