import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';

interface NetResultCardProps {
  income: number;
  expenses: number;
  isLoading: boolean;
}

const NetResultCard = ({ income, expenses, isLoading }: NetResultCardProps) => {
  const { t } = useTranslation('dashboard');

  const net = income - expenses;
  const isPositive = net >= 0;

  return (
    <FinanceOverviewCard
      headerTitle={t('financialHighlights.monthSummary.netResult')}
      primaryValue={
        <Typography fontWeight={700}>
          {isPositive ? '+' : '−'}
          {Math.abs(Math.round(net))} ₪
        </Typography>
      }
      secondaryText={
        isPositive
          ? t('financialHighlights.monthSummary.savedThisMonth')
          : t('financialHighlights.monthSummary.overspentThisMonth')
      }
      icon={AccountBalanceIcon}
      color={isPositive ? '#22c55e' : '#ef4444'}
      isLoading={isLoading}
    />
  );
};

export default NetResultCard;
