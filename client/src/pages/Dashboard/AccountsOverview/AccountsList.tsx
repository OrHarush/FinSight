import Row from '@/components/layout/Containers/Row';
import Paper from '@mui/material/Paper';
import AccountIcon from '@/components/accounts/AccountIcon';
import Column from '@/components/layout/Containers/Column';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import { useAccounts } from '@/hooks/entities/useAccounts';
import Box from '@mui/material/Box';

const AccountsList = () => {
  const { accounts } = useAccounts();

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'center', sm: 'flex-start' }}
      justifyContent={{ xs: 'center', sm: 'flex-start' }}
      gap={4}
      overflow="auto"
    >
      {accounts?.map(account => (
        <Paper
          key={account._id}
          elevation={1}
          sx={{
            padding: 2,
            borderRadius: '12px',
            width: { xs: '100%', sm: '200px' },
            maxWidth: '300px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Row spacing={2} alignItems="center" height="100%">
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
    </Box>
  );
};

export default AccountsList;
