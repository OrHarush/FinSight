import { Chip, LinearProgress, Typography, useTheme } from '@mui/material';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import BudgetChangeBadge from '@/components/features/budgets/BudgetChangeBadge';
import { getBudgetProgressColor } from '@/utils/colorUtils';
import { BudgetCategoryItem } from '@/utils/budgetUtils';

interface BudgetProgressRowProps {
  budget: BudgetCategoryItem;
  usageChange?: number | null;
}

const BudgetProgressRow = ({ budget, usageChange = null }: BudgetProgressRowProps) => {
  const theme = useTheme();

  return (
    <Column spacing={0.5}>
      <Row spacing={2} flex={1}>
        <CategoryIconFrame color={budget.color} icon={budget.icon} />
        <Column spacing={0.5} flex={1} alignItems="flex-start">
          <Row alignItems="center" spacing={1}>
            <Typography variant="body1" fontWeight={600}>
              {budget.name}
            </Typography>
            {usageChange !== null && <BudgetChangeBadge usageChange={usageChange} />}
          </Row>
          <Typography variant="body2" color="text.secondary" dir={'ltr'}>
            ₪{budget.spent.toLocaleString()} / ₪{budget.limit.toLocaleString()}
          </Typography>
        </Column>
      </Row>
      <Row spacing={1} alignItems="center" width="100%">
        <LinearProgress
          variant="determinate"
          value={Math.min(budget.percent, 100)}
          sx={{
            flex: 1,
            height: 10,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getBudgetProgressColor(budget.percent, theme),
              borderRadius: 3,
            },
          }}
        />
        <Chip
          label={`${Math.round(budget.percent)}%`}
          size="small"
          sx={{
            backgroundColor: `${getBudgetProgressColor(budget.percent, theme)}20`,
            color: getBudgetProgressColor(budget.percent, theme),
            fontWeight: 600,
            height: 24,
            minWidth: 52,
          }}
        />
      </Row>
    </Column>
  );
};

export default BudgetProgressRow;
