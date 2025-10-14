import Row from '@/components/layout/Containers/Row';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Chip, Typography } from '@mui/material';
import { AccountDto } from '@/types/Account';

interface AccountMenuItemProps {
  account: AccountDto;
}

const AccountMenuItem = ({ account }: AccountMenuItemProps) => (
  <Row alignItems="center" justifyContent={'space-between'} width={'100%'}>
    <Row spacing={1}>
      <AccountBalanceIcon />
      <Typography>{account.name}</Typography>
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

export default AccountMenuItem;
