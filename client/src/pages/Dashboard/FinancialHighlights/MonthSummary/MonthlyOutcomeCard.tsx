import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import { SvgIconComponent } from '@mui/icons-material';

interface MonthlyOutcomeCardProps {
  income: number;
  expenses: number;
  hasMonthData: boolean;
  isLoading: boolean;
}

const MonthlyOutcomeCard = ({
  income,
  expenses,
  hasMonthData,
  isLoading,
}: MonthlyOutcomeCardProps) => {
  const { t } = useTranslation('dashboard');

  let primaryValue: string;
  let secondaryText: string | undefined;
  let color: string | undefined;
  let icon: SvgIconComponent | undefined;

  if (!hasMonthData) {
    primaryValue = t('noData.title');
    secondaryText = t('noData.detail');
  } else if (expenses > income) {
    primaryValue = t('monthSummary.overBudget');
    secondaryText = t('monthSummary.endedOverIncome');
    icon = ErrorOutlineIcon;
    color = '#ef4444';
  } else {
    primaryValue = t('monthSummary.onBudget');
    secondaryText = t('monthSummary.endedWithinIncome');
    icon = CheckCircleOutlineIcon;
    color = '#22c55e';
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('monthSummary.monthlyOutcome')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={icon || InfoOutlinedIcon}
      color={color || '#6c5ce7'}
      isLoading={isLoading}
    />
  );
};

export default MonthlyOutcomeCard;
