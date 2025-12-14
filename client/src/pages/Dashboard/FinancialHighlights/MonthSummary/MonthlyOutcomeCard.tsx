import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';

interface MonthlyOutcomeCardProps {
  income: number;
  expenses: number;
  isLoading: boolean;
}

const MonthlyOutcomeCard = ({ income, expenses, isLoading }: MonthlyOutcomeCardProps) => {
  const { t } = useTranslation('dashboard');

  const isOnBudget = expenses <= income;

  return (
    <FinanceOverviewCard
      headerTitle={t('financialHighlights.monthSummary.monthlyOutcome')}
      primaryValue={
        <Typography fontWeight={700}>
          {isOnBudget
            ? t('financialHighlights.monthSummary.onBudget')
            : t('financialHighlights.monthSummary.overBudget')}
        </Typography>
      }
      secondaryText={
        isOnBudget
          ? t('financialHighlights.monthSummary.endedWithinIncome')
          : t('financialHighlights.monthSummary.endedOverIncome')
      }
      icon={isOnBudget ? CheckCircleOutlineIcon : ErrorOutlineIcon}
      color={isOnBudget ? '#22c55e' : '#ef4444'}
      isLoading={isLoading}
    />
  );
};

export default MonthlyOutcomeCard;
