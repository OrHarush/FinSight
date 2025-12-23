import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '../FinanceOverviewCard';
import { calculateFinancialHealth, HEALTH_UI } from '@/utils/financialHealth';
import { CurrentMonthCardProps } from '@/components/unusedComponents/FinancialHighlights/CurrentMonth/types';

const FinancialStatusCard = ({
  income,
  expenses,
  isLoading,
  hasMonthData,
}: CurrentMonthCardProps) => {
  const { t } = useTranslation('overview');
  const today = new Date();

  let primaryValue: string;
  let secondaryText: string;
  let isCritical = false;
  let criticalColor: string | undefined;

  if (!hasMonthData || (income === 0 && expenses === 0)) {
    primaryValue = t('noData.title');
    secondaryText = t('noData.detail');
  } else if (income <= 0 && expenses > 0) {
    primaryValue = t('noIncome.title');
    secondaryText = t('noIncome.detail');
    isCritical = true;
    criticalColor = '#ef4444';
  } else {
    const day = today.getDate();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const spentPercentage = Math.round((expenses / income) * 100);
    const expectedPercentage = Math.round((day / totalDays) * 100);

    const { status } = calculateFinancialHealth(income, expenses, today);

    isCritical = status === 'warning' || status === 'critical';
    criticalColor = HEALTH_UI[status].color;

    primaryValue = t(`financialStatusCard.status.${status}`);
    secondaryText = t('financialStatusCard.detail', {
      actual: spentPercentage,
      expected: expectedPercentage,
      day,
    });
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('financialStatusCard.title')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={MonitorHeartIcon}
      isLoading={isLoading}
      isCritical={isCritical}
      criticalColor={criticalColor}
    />
  );
};

export default FinancialStatusCard;
