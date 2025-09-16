import { Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import CallMadeIcon from '@mui/icons-material/CallMade';

const RecentTransactions = () => {
  return (
    <Card>
      <CardContent sx={{ padding: 4 }}>
        <Column spacing={4}>
          <Typography>Recent Transactions Component</Typography>
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
