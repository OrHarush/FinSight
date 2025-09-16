import { Button, Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import CallMadeIcon from '@mui/icons-material/CallMade';
import VisibilityIcon from '@mui/icons-material/Visibility';

const RecentTransactions = () => {
  return (
    <Card>
      <CardContent sx={{ padding: 4 }}>
        <Column spacing={4} width={'100%'}>
          <Row width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography>Recent Transactions</Typography>
            <Button variant={'outlined'} startIcon={<VisibilityIcon />}>
              View All
            </Button>
          </Row>

          <Row justifyContent={'space-between'}>
            <Row spacing={2} alignItems={'center'}>
              <CallMadeIcon />
              <Column>
                <Typography variant="h6">Salary</Typography>
                <Typography variant="body2">Salary</Typography>
              </Column>
            </Row>
            <Typography>+8500$</Typography>
          </Row>
        </Column>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
