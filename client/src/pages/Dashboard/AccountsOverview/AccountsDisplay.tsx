import Row from '@/components/Layout/Containers/Row';
import Paper from '@mui/material/Paper';
import AccountIcon from '@/components/AccountIcon';
import Column from '@/components/Layout/Containers/Column';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/CurrencyText';
import NoAccounts from '@/components/Placeholders/NoAccounts';
import { useAccounts } from '@/providers/EntitiesProviders/AccountsProvider';

const AccountsDisplay = () => {
  const { accounts } = useAccounts();

  return (
    <Row spacing={4} justifyContent="center" overflow={'auto'}>
      {accounts.length ? (
        accounts?.map(account => (
          <Paper
            key={account._id}
            elevation={1}
            sx={{
              padding: 2,
              borderRadius: '12px',
              width: '200px',
            }}
          >
            <Row spacing={2} alignItems={'center'}>
              <AccountIcon />
              <Column justifyContent={'center'} alignItems={'flex-start'}>
                <Typography>{account.name}</Typography>
                <CurrencyText variant={'h5'} fontWeight={600} value={account.balance} />
              </Column>
            </Row>
          </Paper>
        ))
      ) : (
        <NoAccounts />
      )}
    </Row>
  );
};

export default AccountsDisplay;
