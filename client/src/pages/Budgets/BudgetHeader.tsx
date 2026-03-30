import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { useNavBarDate, usePageHeader } from '@/components/shared/layout/PageHeaderContext';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface BudgetHeaderProps {
  date: Dayjs;
  onDateChange: (newDate: Dayjs) => void;
  onCreateBudget: () => void;
}

const BudgetHeader = ({ date, onDateChange, onCreateBudget }: BudgetHeaderProps) => {
  const { t } = useTranslation('budgets');
  const isMobile = useIsMobile();

  usePageHeader(t('pageTitle'), true);

  const changeDate = useCallback(
    (newDate: Dayjs) => {
      if (newDate) {
        onDateChange(newDate.startOf('month'));
      }
    },
    [onDateChange]
  );

  useNavBarDate(date, changeDate);

  if (isMobile) {
    return null;
  }

  return (
    <Row justifyContent="flex-end">
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateBudget}>
        {t('createBudget')}
      </Button>
    </Row>
  );
};

export default BudgetHeader;
