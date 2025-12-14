import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '../FinanceOverviewCard';
import { calculateFinancialHealth, HEALTH_UI } from '@/utils/financialHealth';

interface FinancialStatusCardProps {
  income: number;
  expenses: number;
  isLoading: boolean;
}

const FinancialStatusCard = ({ income, expenses, isLoading }: FinancialStatusCardProps) => {
  const { t } = useTranslation('dashboard');

  const today = new Date();
  const day = today.getDate();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const spentRatio = income > 0 ? expenses / income : 0;
  const expectedRatio = day / totalDays;

  const spentPercentage = Math.round(spentRatio * 100);
  const expectedPercentage = Math.round(expectedRatio * 100);

  const { status } = calculateFinancialHealth(income, expenses, today);
  const { label, color } = HEALTH_UI[status];

  return (
    <FinanceOverviewCard
      headerTitle={t('financialHighlights.currentMonth.financialStatus')}
      primaryValue={<Typography fontWeight={700}>{label}</Typography>}
      secondaryText={t('financialHighlights.currentMonth.healthDetail', {
        actual: spentPercentage,
        expected: expectedPercentage,
        day,
      })}
      icon={MonitorHeartIcon}
      color={color}
      isLoading={isLoading}
      isPrimary
    />
  );
};

export default FinancialStatusCard;
