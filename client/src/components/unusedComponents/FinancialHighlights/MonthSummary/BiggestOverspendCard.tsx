import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/components/unusedComponents/FinancialHighlights/FinanceOverviewCard';
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
  const { t } = useTranslation('overview');

  const hasOverspend =
    hasMonthData && !!categoryName && typeof overspendAmount === 'number' && overspendAmount > 0;

  let primaryValue: string;
  let secondaryText: string | undefined;
  let icon: SvgIconComponent | undefined;

  if (!hasMonthData) {
    primaryValue = t('noData.title');
    icon = InfoOutlineIcon;
  } else if (hasOverspend) {
    primaryValue = categoryName!;
    secondaryText = t('monthSummary.overspentByAmount', {
      amount: Math.round(overspendAmount),
    });
    icon = WarningAmberIcon;
  } else {
    primaryValue = t('monthSummary.noOverspend');
    secondaryText = t('monthSummary.withinBudget');
    icon = CheckCircleOutlineIcon;
  }

  return (
    <FinanceOverviewCard
      headerTitle={t('monthSummary.biggestOverspend')}
      primaryValue={primaryValue}
      secondaryText={secondaryText}
      icon={icon}
      isLoading={isLoading}
    />
  );
};

export default BiggestOverspendCard;
