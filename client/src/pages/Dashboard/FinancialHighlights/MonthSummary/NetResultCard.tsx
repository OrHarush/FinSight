import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import { SvgIconComponent } from '@mui/icons-material';

interface NetResultCardProps {
  income: number;
  expenses: number;
  hasMonthData: boolean;
  isLoading: boolean;
}

const NetResultCard = ({ income, expenses, hasMonthData, isLoading }: NetResultCardProps) => {
  const { t } = useTranslation('dashboard');

  let primaryValue: string;
  let secondaryText: string | undefined;
  let icon: SvgIconComponent | undefined;
  let color: string | undefined;

  if (!hasMonthData) {
    primaryValue = t('noData.title');
  } else {
    const net = income - expenses;
    const isPositive = net >= 0;

    primaryValue = `${isPositive ? '+' : '−'}${Math.abs(Math.round(net))} ₪`;
    secondaryText = isPositive
      ? t('monthSummary.savedThisMonth')
      : t('monthSummary.overspentThisMonth');
    icon = AccountBalanceIcon;
    color = isPositive ? '#22c55e' : '#ef4444';
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('monthSummary.netResult')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={icon || InfoOutlinedIcon}
      color={color || '#6c5ce7'}
      isLoading={isLoading}
    />
  );
};

export default NetResultCard;
