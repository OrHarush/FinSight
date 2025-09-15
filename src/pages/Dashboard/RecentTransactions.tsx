import { Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import { BalanceSharp } from '@mui/icons-material';
import Column from '@/components/Layout/Column';

const RecentTransactions = () => {
  return (
    <Card>
      <CardContent>
        Recent Transactions Component
        <Row justifyContent={'space-between'}>
          <Row spacing={2} alignItems={'center'}>
            <BalanceSharp />
            <Column>
              <Typography variant="h6">Salary</Typography>
              <Typography variant="h6">9700</Typography>
            </Column>
          </Row>
          <Typography>8500</Typography>
        </Row>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
