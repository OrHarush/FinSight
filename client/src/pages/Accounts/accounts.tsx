import { Button, Card, CardContent, Typography } from '@mui/material';
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
      <Card sx={{ width: '350px', maxHeight: '300px' }}>
        <CardContent sx={{ padding: 4, height: '100%' }}>
          <Column justifyContent={'space-between'} height={'100%'} spacing={1}>
            <Row justifyContent={'space-between'}>
              <Row alignItems={'center'} spacing={1}>
                <AccountBalanceIcon />
                <Column>
                  <Typography fontWeight={900}>Bank Balance</Typography>
                  <Typography>Checking</Typography>
                </Column>
              </Row>
              <AccountBalanceIcon />
            </Row>

            <Row justifyContent={'space-between'}>
              <Typography variant={'body2'} fontWeight={100}>
                Opening Balance:
              </Typography>
              <Typography>2000</Typography>
            </Row>
            <Row justifyContent={'space-between'}>
              <Typography variant={'body2'} fontWeight={100}>
                As of:
              </Typography>
              <Typography>
                {new Date().toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Typography>
            </Row>
            <Row justifyContent={'space-between'}>
              <Typography variant={'body2'} fontWeight={100}>
                Institution:
              </Typography>
              <Typography>Leumi</Typography>
            </Row>
            <Row justifyContent={'space-between'}>
              <Typography variant={'body2'} fontWeight={100}>
                Account:
              </Typography>
              <Typography>••••4321</Typography>
            </Row>
          </Column>
        </CardContent>
      </Card>
      <CreateCategoryDialog open={isDialogOpen} onClose={closeDialog} onSubmit={() => {}} />
    </Column>
  );
};

export default Accounts;
