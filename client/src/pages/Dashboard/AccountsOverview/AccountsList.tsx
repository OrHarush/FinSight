import Row from '@/components/Layout/Containers/Row';
import Paper from '@mui/material/Paper';
import AccountIcon from '@/components/Accounts/AccountIcon';
import Column from '@/components/Layout/Containers/Column';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/CurrencyText';
import { useAccounts } from '@/hooks/useAccounts';

const AccountsList = () => {
  const { accounts } = useAccounts();

  return (
    <Row spacing={4} overflow={'auto'}>
      {accounts?.map(account => (
        <Paper
          key={account._id}
          elevation={1}
          sx={{
            padding: 2,
            borderRadius: '12px',
            width: '200px',
            height: '100px',
          }}
        >
          <Row spacing={2} alignItems={'center'} height={'100%'}>
            <AccountIcon icon={account.icon} />
            <Column justifyContent="center" alignItems="flex-start" spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {account.name}
              </Typography>
              <CurrencyText variant="h6" fontWeight={700} value={account.balance} isAnimated />
            </Column>
          </Row>
        </Paper>
      ))}
    </Row>
  );
};

export default AccountsList;
