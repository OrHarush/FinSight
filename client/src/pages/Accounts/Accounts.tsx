import { Button, Grid, Typography } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import { useOpen } from '@/hooks/useOpen';
import CreateAccountDialog from '@/components/Dialogs/CreateAccountDialog';
import AccountCard from '@/pages/Accounts/AccountCard';
import { useAccounts } from '@/providers/EntitiesProviders/AccountsProvider';
import PageLayout from '@/components/Layout/PageLayout';
import NoAccounts from '@/components/Placeholders/NoAccounts';

const Accounts = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();
  const { accounts, isLoading } = useAccounts();

  return (
    <PageLayout>
      <Row alignItems="center" justifyContent="space-between" flexWrap="wrap" spacing={2}>
        <Typography variant="h4" fontWeight={700}>
          Accounts
        </Typography>
        <Button variant="outlined" onClick={openDialog}>
          Create Account
        </Button>
      </Row>
      {!isLoading ? (
        accounts.length ? (
          <Grid container spacing={3}>
            {accounts?.map(account => (
              <Grid key={account._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <AccountCard account={account} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <NoAccounts />
        )
      ) : (
        <Grid size={{ xs: 12 }}>
          <Typography>Loading...</Typography>
        </Grid>
      )}
      <CreateAccountDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
    </PageLayout>
  );
};

export default Accounts;
