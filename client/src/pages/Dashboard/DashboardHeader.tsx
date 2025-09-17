import Row from '@/components/Layout/Row';
import { DatePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/APP_ROUTES';
import PageHeader from '@/components/Layout/PageHeader';

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <PageHeader pageTitle={'Financial Dashboard'}>
      <Row spacing={2} alignItems="center">
        <DatePicker
          slotProps={{
            textField: {
              size: 'small',
              sx: { width: 200 },
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(APP_ROUTES.TRANSACTIONS_URL)}
          sx={{ borderRadius: '12px', fontWeight: 600, minWidth: '180px' }}
        >
          Add Transaction
        </Button>
      </Row>
    </PageHeader>
  );
};

export default DashboardHeader;
