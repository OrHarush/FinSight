import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import HealthIndicatorsGrid from '@/components/features/overview/HealthIndicatorsGrid';
import Column from '@/components/shared/layout/containers/Column';
import { HealthTile, RetrospectiveSummary } from '@/hooks/business/useFinancialHealthIndicators';
import RetrospectiveHero from '@/pages/Overview/MonthlyFinancialHealth/variants/RetrospectiveVariant/RetrospectiveHero';

interface RetrospectiveVariantProps {
  date: Dayjs;
  summary: RetrospectiveSummary;
}

const formatAmount = (amount: number, language: string): string =>
  Math.round(amount).toLocaleString(language, { maximumFractionDigits: 0 });

const buildMostExpensiveDayTile = (
  t: ReturnType<typeof useTranslation<'overview'>>['t'],
  language: string,
  date: Dayjs,
  mostExpensiveDay: RetrospectiveSummary['mostExpensiveDay']
): HealthTile => {
  if (!mostExpensiveDay) {
    return {
      label: t('retrospectiveCard.mostExpensiveDayLabel'),
      value: t('retrospectiveCard.mostExpensiveDayEmpty'),
      description: '',
    };
  }

  const formattedDate = date.date(mostExpensiveDay.day).format('D MMMM');

  return {
    label: t('retrospectiveCard.mostExpensiveDayLabel'),
    value: t('retrospectiveCard.mostExpensiveDayValue', {
      day: formattedDate,
      amount: formatAmount(mostExpensiveDay.amount, language),
    }),
    description: '',
  };
};

const RetrospectiveVariant = ({ date, summary }: RetrospectiveVariantProps) => {
  const { t, i18n } = useTranslation('overview');

  const mostExpensiveDayTile = buildMostExpensiveDayTile(
    t,
    i18n.language,
    date,
    summary.mostExpensiveDay
  );

  const spendFreeDaysTile: HealthTile = {
    label: t('retrospectiveCard.spendFreeDaysLabel'),
    value: t('retrospectiveCard.spendFreeDaysValue', { count: summary.spendFreeDays }),
    description: '',
  };

  return (
    <Column spacing={2.5} height="100%" justifyContent="center">
      <RetrospectiveHero dailyAverage={summary.dailyAverage} daysInMonth={summary.daysInMonth} />
      <HealthIndicatorsGrid tiles={[mostExpensiveDayTile, spendFreeDaysTile]} />
    </Column>
  );
};

export default RetrospectiveVariant;
