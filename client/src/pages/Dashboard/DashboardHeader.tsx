import Row from '@/components/Layout/Row';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, Typography } from '@mui/material';

const DashboardHeader = () => {
  return (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <Typography variant={'h3'} fontWeight={700}>
        Financial Dashboard
      </Typography>
      <Row spacing={2}>
        <DatePicker />
        <Button variant={'contained'}>Add Transaction</Button>
      </Row>
    </Row>
  );
};

export default DashboardHeader;
