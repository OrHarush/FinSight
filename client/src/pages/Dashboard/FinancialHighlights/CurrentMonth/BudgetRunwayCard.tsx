import { useTranslation } from 'react-i18next';
import { CurrentMonthCardProps } from '@/pages/Dashboard/FinancialHighlights/CurrentMonth/types';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const BudgetRunwayCard = ({ income, expenses, isLoading, hasMonthData }: CurrentMonthCardProps) => {
  const { t } = useTranslation('dashboard');
  const today = new Date();

  let primaryValue: string;
  let secondaryText: string | undefined;
  let isCritical = false;
  let criticalColor: string | undefined;

  if (!hasMonthData || (income === 0 && expenses === 0)) {
    primaryValue = t('noData.title');
  } else if (income <= 0 && expenses > 0) {
    primaryValue = t('noIncome.title');
    isCritical = true;
    criticalColor = '#ef4444';
  } else {
    const currentDay = today.getDate();
    const currentDailyBurn = expenses / currentDay;
    const remainingBudget = income - expenses;

    const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const remainingDaysInMonth = totalDaysInMonth - currentDay;

    const daysLeft = currentDailyBurn > 0 ? Math.floor(remainingBudget / currentDailyBurn) : 0;

    const runsOutThisMonth = daysLeft < remainingDaysInMonth;

    if (daysLeft <= 0) {
      primaryValue = t('budgetRunwayCard.noRunway');
      secondaryText = t('budgetRunwayCard.noRunwayDetail');
      isCritical = true;
      criticalColor = '#ef4444';
    } else if (runsOutThisMonth) {
      const projectedEndDate = new Date(today);
      projectedEndDate.setDate(today.getDate() + daysLeft);

      primaryValue = t('budgetRunwayCard.daysLeft', { count: daysLeft });
      secondaryText = t('budgetRunwayCard.runwayDetail', {
        date: projectedEndDate.toLocaleDateString(),
      });

      isCritical = true;
      criticalColor = daysLeft <= 7 ? '#ef4444' : '#f59e0b';
    } else {
      primaryValue = t('budgetRunwayCard.onTrack');
      secondaryText = t('budgetRunwayCard.enoughForMonth');
      // neutral state → NOT critical
    }
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('budgetRunwayCard.title')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={CalendarTodayIcon}
      isLoading={isLoading}
      isCritical={isCritical}
      criticalColor={criticalColor}
    />
  );
};

export default BudgetRunwayCard;
