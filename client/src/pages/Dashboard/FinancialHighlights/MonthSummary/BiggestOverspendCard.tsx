import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';

interface BiggestOverspendCardProps {
  categoryName?: string;
  overspendAmount?: number;
  isLoading: boolean;
}

const BiggestOverspendCard = ({
  categoryName,
  overspendAmount,
  isLoading,
}: BiggestOverspendCardProps) => {
  const { t } = useTranslation('dashboard');

  const hasOverspend = !!categoryName && typeof overspendAmount === 'number' && overspendAmount > 0;

  return hasOverspend ? (
    <FinanceOverviewCard
      headerTitle={t('financialHighlights.monthSummary.biggestOverspend')}
      primaryValue={<Typography fontWeight={700}>{categoryName}</Typography>}
      secondaryText={t('financialHighlights.monthSummary.overspentByAmount', {
        amount: Math.round(overspendAmount),
      })}
      icon={WarningAmberIcon}
      color="#ef4444"
      isLoading={isLoading}
    />
  ) : (
    <FinanceOverviewCard
      headerTitle={t('financialHighlights.monthSummary.biggestOverspend')}
      primaryValue={
        <Typography fontWeight={700}>
          {t('financialHighlights.monthSummary.noOverspend')}
        </Typography>
      }
      secondaryText={t('financialHighlights.monthSummary.withinBudget')}
      icon={CheckCircleOutlineIcon}
      color="#22c55e"
      isLoading={isLoading}
    />
  );
};

export default BiggestOverspendCard;
