import Row from '@/components/Layout/Row';
import { DatePicker } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import PageHeader from '@/components/Layout/PageHeader';
import { useDashboardDate } from '@/pages/Dashboard/DashboardDateProvider';
import { PickerValue } from '@mui/x-date-pickers/internals';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useDashboardDate();

  const changeDate = (newDate: PickerValue) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  return (
    <PageHeader pageTitle={'Financial Dashboard'}>
      <Row spacing={2} alignItems="center">
        <DatePicker
          views={['year', 'month']}
          label="Year and Month"
          value={selectedDate}
          onChange={changeDate}
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
          onClick={() => navigate(ROUTES.TRANSACTIONS_URL)}
          sx={{ borderRadius: '12px', fontWeight: 600, minWidth: '180px' }}
        >
          Add Transaction
        </Button>
      </Row>
    </PageHeader>
  );
};

export default DashboardHeader;
