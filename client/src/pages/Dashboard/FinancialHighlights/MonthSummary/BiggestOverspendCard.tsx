import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { SvgIconComponent } from '@mui/icons-material';

interface BiggestOverspendCardProps {
  categoryName?: string;
  overspendAmount?: number;
  hasMonthData: boolean;
  isLoading: boolean;
}

const BiggestOverspendCard = ({
  categoryName,
  overspendAmount,
  hasMonthData,
  isLoading,
}: BiggestOverspendCardProps) => {
  const { t } = useTranslation('dashboard');

  const hasOverspend =
    hasMonthData && !!categoryName && typeof overspendAmount === 'number' && overspendAmount > 0;

  let primaryValue: string;
  let secondaryText: string | undefined;
  let color: string | undefined;
  let icon: SvgIconComponent | undefined;

  if (!hasMonthData) {
    primaryValue = t('noData.title');
    icon = InfoOutlineIcon;
    color = '#6c5ce7';
  } else if (hasOverspend) {
    primaryValue = categoryName!;
    secondaryText = t('monthSummary.overspentByAmount', {
      amount: Math.round(overspendAmount),
    });
    icon = WarningAmberIcon;
    color = '#ef4444';
  } else {
    primaryValue = t('monthSummary.noOverspend');
    secondaryText = t('monthSummary.withinBudget');
    icon = CheckCircleOutlineIcon;
    color = '#22c55e';
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('monthSummary.biggestOverspend')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={icon}
      color={color}
      isLoading={isLoading}
    />
  );
};

export default BiggestOverspendCard;
