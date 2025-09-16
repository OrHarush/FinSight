import { Button, Card, CardContent, Paper, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import { useOpen } from '@/hooks/useOpen';
import CreateCategoryDialog from '@/components/CreateCategoryDialog';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Accounts = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();

  return (
    <Column height="100%" width={'1200px'} spacing={4} alignSelf={'center'}>
      <Row alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant={'h3'} fontWeight={700}>
          Accounts
        </Typography>
        <Row spacing={1}>
          <Button variant={'outlined'} onClick={openDialog}>
            Create Account
          </Button>
        </Row>
      </Row>
      <Card sx={{ width: '600px', maxHeight: '300px' }}>
        <CardContent sx={{ padding: 4, height: '100%' }}>
          <Column justifyContent={'space-between'} height={'100%'}>
            <Column spacing={1}>
              <Row justifyContent={'space-between'}>
                <Row spacing={1}>
                  <AccountBalanceIcon />
                  <Typography>Or</Typography>
                </Row>
                <Typography>2000</Typography>
              </Row>
            </Column>
          </Column>
        </CardContent>
      </Card>
      <CreateCategoryDialog open={isDialogOpen} onClose={closeDialog} onSubmit={() => {}} />
    </Column>
  );
};

export default Accounts;
