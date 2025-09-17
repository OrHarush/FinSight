import { Button, Grid, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { useOpen } from '@/hooks/useOpen';
import CreateAccountDialog from '@/components/Dialogs/CreateAccountDialog';
import AccountCard from '@/pages/Accounts/AccountCard';
import { useAccounts } from '@/providers/AccountsProvider';

const Accounts = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();
  const { accounts, isLoading } = useAccounts();

  return (
    <Column height="100%" width={'1200px'} spacing={4} alignSelf={'center'}>
      <Row alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant={'h4'} fontWeight={700}>
          Accounts
        </Typography>
        <Row spacing={1}>
          <Button variant={'outlined'} onClick={openDialog}>
            Create Account
          </Button>
        </Row>
      </Row>
      <Grid container spacing={4}>
        {!isLoading ? (
          accounts?.map(account => <AccountCard key={account._id} account={account} />)
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Grid>

      <CreateAccountDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
    </Column>
  );
};

export default Accounts;
