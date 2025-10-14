import Row from '@/components/layout/Containers/Row';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/common/CurrencyText';
import Column from '@/components/layout/Containers/Column';
import { AccountDto } from '@/types/Account';

interface AccountDetailsProps {
  account: AccountDto;
}

const AccountDetails = ({ account }: AccountDetailsProps) => (
  <Column spacing={1.5}>
    <Row justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        Opening Balance:
      </Typography>
      <CurrencyText fontWeight={600} value={account.balance} />
    </Row>
    <Row justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        Institution:
      </Typography>
      <Typography fontWeight={500}>{account.institution}</Typography>
    </Row>
    <Row justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        Account Number:
      </Typography>
      <Typography fontWeight={500}>{account.accountNumber}</Typography>
    </Row>
    <Row justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        Last Synced:
      </Typography>
      <Typography fontWeight={500}>
        {account.lastSynced
          ? new Date(account.lastSynced).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Not synced yet'}
      </Typography>
    </Row>
  </Column>
);

export default AccountDetails;
