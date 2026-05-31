import { Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import { CategorySummary } from '@/hooks/monthlyReport/useMonthlyReportPopup';

interface MonthlyReportCategoryRowProps {
  rank: number;
  category: CategorySummary;
}

const MonthlyReportCategoryRow = ({ rank, category }: MonthlyReportCategoryRowProps) => {
  const hasBudget = category.budget !== null && category.budget > 0;
  const isOverBudget = hasBudget && category.amount > category.budget!;

  return (
    <Row justifyContent="space-between" alignItems="center" spacing={1}>
      <Row alignItems="center" spacing={1.5} minWidth={0}>
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{ minWidth: 18, textAlign: 'center', flexShrink: 0 }}
        >
          {rank}
        </Typography>
        <CategoryIconFrame icon={category.icon} color={category.color} />
        <Typography variant="body2" fontWeight={500} noWrap>
          {category.name}
        </Typography>
      </Row>
      <Column alignItems="flex-end" spacing={0} flexShrink={0}>
        <CurrencyText value={-category.amount} hasColor variant="body1" fontWeight={600} />
        {hasBudget && (
          <Typography
            variant="caption"
            color={isOverBudget ? 'error.main' : 'text.secondary'}
            dir="ltr"
          >
            {`₪${category.budget!.toLocaleString()} / ₪${category.amount.toLocaleString()}`}
          </Typography>
        )}
      </Column>
    </Row>
  );
};

export default MonthlyReportCategoryRow;
