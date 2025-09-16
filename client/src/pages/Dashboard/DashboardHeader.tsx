import Row from '@/components/Layout/Row';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const DashboardHeader = () => {
  return (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <Typography variant={'h3'} fontWeight={700}>
        Financial Dashboard
      </Typography>
      <Row spacing={2} alignItems={'center  '}>
        <DatePicker
          slotProps={{
            textField: {
              size: 'small',
              sx: { width: 200 },
            },
          }}
        />
        <Button variant={'contained'} startIcon={<AddIcon />}>
          Add Transaction
        </Button>{' '}
      </Row>
    </Row>
  );
};

export default DashboardHeader;
