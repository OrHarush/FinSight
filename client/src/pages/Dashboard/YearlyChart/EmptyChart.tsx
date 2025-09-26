import { Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import Column from '@/components/Layout/Containers/Column';

const EmptyChart = () => (
  <Column
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
      color: 'gray',
    }}
  >
    <BarChartIcon sx={{ fontSize: 50, mb: 1, opacity: 0.5 }} />
    <Typography variant="body1">No transactions yet</Typography>
    <Typography variant="body2">Add some to see your income & expenses graph</Typography>
  </Column>
);

export default EmptyChart;
