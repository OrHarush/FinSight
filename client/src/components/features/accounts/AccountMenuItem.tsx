import Row from '@/components/shared/layout/containers/Row';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Chip, Typography } from '@mui/material';
import { AccountDto } from '@/types/Account';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';

interface AccountMenuItemProps {
  account: AccountDto;
}

const AccountMenuItem = ({ account }: AccountMenuItemProps) => {
  const AccountIcon = (account.icon && bankAccountIconMap[account.icon]) || AccountBalanceIcon;

  return (
    <Row alignItems="center" justifyContent={'space-between'} width={'100%'}>
      <Row spacing={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
        <AccountIcon sx={{ flexShrink: 0 }} />
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {account.name}
        </Typography>
      </Row>
      {account.isPrimary && (
        <Chip
          label="Primary"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'primary.main',
            borderColor: 'primary.main',
            ml: 0.5,
          }}
          variant="outlined"
        />
      )}
    </Row>
  );
};

export default AccountMenuItem;
