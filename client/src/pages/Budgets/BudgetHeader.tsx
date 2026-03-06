import PageHeader from '@/components/shared/layout/page/PageHeader';
import DateSelector from '@/components/shared/ui/DateSelector';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import Row from '@/components/shared/layout/containers/Row';

interface BudgetHeaderProps {
  date: Dayjs;
  onDateChange: (newDate: Dayjs) => void;
  onCreateBudget: () => void;
}

const BudgetHeader = ({ date, onDateChange, onCreateBudget }: BudgetHeaderProps) => {
  const { t } = useTranslation('budget');
  const isMobile = useIsMobile();

  const changeDate = (newDate: Dayjs | null) => {
    if (newDate) {
      onDateChange(newDate.startOf('month'));
    }
  };

  return (
    <PageHeader entityName={'budget'}>
      <Row spacing={2}>
        <DateSelector value={date} onChange={changeDate} />
        {!isMobile && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateBudget}>
            {t('createBudget')}
          </Button>
        )}
      </Row>
    </PageHeader>
  );
};

export default BudgetHeader;
