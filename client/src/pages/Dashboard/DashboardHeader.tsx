import Row from '@/components/Layout/Row';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/APP_ROUTES';

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <Typography variant={'h4'} fontWeight={700}>
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
        <Button
          variant={'contained'}
          startIcon={<AddIcon />}
          onClick={() => navigate(APP_ROUTES.TRANSACTIONS_URL)}
        >
          Add Transaction
        </Button>{' '}
      </Row>
    </Row>
  );
};

export default DashboardHeader;
