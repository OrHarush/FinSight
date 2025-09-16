import { Card, CardContent } from '@mui/material';
import { LineChart } from '@mui/x-charts';

const BalanceTrend = () => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ padding: 4 }}>Balance Trend Component</CardContent>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        height={300}
      />
    </Card>
  );
};

export default BalanceTrend;
