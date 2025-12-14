import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '../FinanceOverviewCard';
import { calculateFinancialHealth } from '@/utils/financialHealth';

interface Props {
  income: number;
  expenses: number;
  isLoading: boolean;
}

const DailySpendCard = ({ income, expenses, isLoading }: Props) => {
  const { t } = useTranslation('dashboard');

  const today = new Date();
  const day = today.getDate();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const remainingDays = Math.max(totalDays - day, 1);
  const remainingBudget = income - expenses;
  const dailyLimit = remainingBudget / remainingDays;

  const currentDailyBurn = expenses / day;
  const dailyGap = currentDailyBurn - dailyLimit;

  const { status } = calculateFinancialHealth(income, expenses, today);
  const isWarning = status === 'risk' || status === 'critical';

  const headerTitle = isWarning
    ? t('financialHighlights.currentMonth.requiredDailySpend')
    : t('financialHighlights.currentMonth.dailySpendCapacity');

  const secondaryText = isWarning
    ? t('financialHighlights.currentMonth.dailySpendGap', {
        current: Math.round(currentDailyBurn),
        target: Math.round(dailyLimit),
        gap: Math.round(dailyGap),
      })
    : t('financialHighlights.currentMonth.stayingBelowKeepsOnTrack');

  const color = status === 'critical' ? '#ef4444' : status === 'risk' ? '#f59e0b' : '#22c55e';

  return (
    <FinanceOverviewCard
      headerTitle={headerTitle}
      primaryValue={<Typography fontWeight={700}>{Math.round(dailyLimit)} ₪ / day</Typography>}
      secondaryText={secondaryText}
      icon={AccountBalanceWalletIcon}
      color={color}
      isLoading={isLoading}
    />
  );
};

export default DailySpendCard;
