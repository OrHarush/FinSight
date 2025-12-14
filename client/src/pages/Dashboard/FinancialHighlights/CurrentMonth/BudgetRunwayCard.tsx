import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '../FinanceOverviewCard';

interface Props {
  income: number;
  expenses: number;
  isLoading: boolean;
}

const BudgetRunwayCard = ({ income, expenses, isLoading }: Props) => {
  const { t } = useTranslation('dashboard');

  const today = new Date();
  const day = today.getDate();

  if (income <= 0 || expenses <= 0 || day <= 0) {
    return (
      <FinanceOverviewCard
        headerTitle={t('financialHighlights.currentMonth.budgetRunway')}
        primaryValue={<Typography fontWeight={700}>—</Typography>}
        secondaryText={t('financialHighlights.currentMonth.insufficientData')}
        icon={CalendarTodayIcon}
        color="#64748b"
        isLoading={isLoading}
      />
    );
  }

  const currentDailyBurn = expenses / day;
  const remainingBudget = income - expenses;

  const daysLeft = currentDailyBurn > 0 ? Math.floor(remainingBudget / currentDailyBurn) : Infinity;

  const isCritical = daysLeft <= 7;
  const isWarning = daysLeft <= 14;

  const color = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';

  const projectedEndDate = new Date(today);
  projectedEndDate.setDate(today.getDate() + Math.max(daysLeft, 0));

  return (
    <FinanceOverviewCard
      headerTitle={t('financialHighlights.currentMonth.budgetRunway')}
      primaryValue={
        <Typography fontWeight={700}>
          {t('financialHighlights.currentMonth.daysLeft', { count: daysLeft })}
        </Typography>
      }
      secondaryText={
        daysLeft > 0
          ? t('financialHighlights.currentMonth.runwayDetail', {
              date: projectedEndDate.toLocaleDateString(),
            })
          : t('financialHighlights.currentMonth.runwayExceeded')
      }
      icon={CalendarTodayIcon}
      color={color}
      isLoading={isLoading}
    />
  );
};

export default BudgetRunwayCard;
