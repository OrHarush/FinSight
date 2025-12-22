import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '../FinanceOverviewCard';
import { CurrentMonthCardProps } from '@/pages/Dashboard/FinancialHighlights/CurrentMonth/types';

const DailySpendCard = ({ income, expenses, isLoading, hasMonthData }: CurrentMonthCardProps) => {
  const { t } = useTranslation('dashboard');
  const today = new Date();

  let headerTitle: string;
  let primaryValue: string | undefined;
  let secondaryText: string | undefined;
  let isCritical = false;
  let criticalColor: string | undefined;

  if (!hasMonthData || (income === 0 && expenses === 0)) {
    headerTitle = t('dailySpendCard.capacity.title');
    primaryValue = t('noData.title');
  } else if (income <= 0 && expenses > 0) {
    headerTitle = t('dailySpendCard.capacity.title');
    primaryValue = t('noIncome.title');
  } else {
    const day = today.getDate();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const remainingDays = Math.max(totalDays - day, 1);
    const remainingBudget = income - expenses;

    const dailyLimit = remainingBudget / remainingDays;
    const currentDailyBurn = expenses / day;

    const isWarning = currentDailyBurn > dailyLimit;

    headerTitle = isWarning
      ? t('dailySpendCard.required.title')
      : t('dailySpendCard.capacity.title');

    primaryValue = t('dailySpendCard.valuePerDay', {
      amount: Math.round(dailyLimit),
    });

    secondaryText = isWarning
      ? t('dailySpendCard.required.gap', {
          current: Math.round(currentDailyBurn),
          target: Math.round(dailyLimit),
          gap: Math.round(currentDailyBurn - dailyLimit),
        })
      : t('dailySpendCard.capacity.belowKeepsOnTrack');

    if (isWarning) {
      isCritical = true;
      criticalColor = '#f59e0b';
    }
  }

  return (
    <FinanceOverviewCard
      headerTitle={headerTitle}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={AccountBalanceWalletIcon}
      isLoading={isLoading}
      isCritical={isCritical}
      criticalColor={criticalColor}
    />
  );
};

export default DailySpendCard;
