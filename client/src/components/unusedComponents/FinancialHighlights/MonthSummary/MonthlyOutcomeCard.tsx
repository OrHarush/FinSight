import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/components/unusedComponents/FinancialHighlights/FinanceOverviewCard';
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
  const { t } = useTranslation('overview');

  let primaryValue: string;
  let secondaryText: string | undefined;
  let icon: SvgIconComponent | undefined;

  if (!hasMonthData) {
    primaryValue = t('noData.title');
    secondaryText = t('noData.detail');
  } else if (expenses > income) {
    primaryValue = t('monthSummary.overBudget');
    secondaryText = t('monthSummary.endedOverIncome');
    icon = ErrorOutlineIcon;
  } else {
    primaryValue = t('monthSummary.onBudget');
    secondaryText = t('monthSummary.endedWithinIncome');
    icon = CheckCircleOutlineIcon;
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('monthSummary.monthlyOutcome')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={icon || InfoOutlinedIcon}
      isLoading={isLoading}
    />
  );
};

export default MonthlyOutcomeCard;
