import PageHeader from '@/components/shared/layout/page/PageHeader';
import DateSelector from '@/components/shared/ui/DateSelector';
import { Dayjs } from 'dayjs';

interface BudgetHeaderProps {
  date: Dayjs;
  onDateChange: (newDate: Dayjs) => void;
}

const BudgetHeader = ({ date, onDateChange }: BudgetHeaderProps) => {
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      onDateChange(newDate.startOf('month'));
    }
  };

  return (
    <PageHeader entityName={'budget'}>
      <DateSelector value={date} onChange={handleDateChange} />
    </PageHeader>
  );
};

export default BudgetHeader;
