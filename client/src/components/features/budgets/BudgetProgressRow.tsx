import { Chip, LinearProgress, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import BudgetChangeBadge from '@/components/features/budgets/BudgetChangeBadge';
import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { getBudgetProgressColor } from '@/utils/color';
import { BudgetCategoryItem } from '@/utils/entities/budget';

interface BudgetProgressRowProps {
  budget: BudgetCategoryItem;
  usageChange?: number | null;
  actions?: ReactNode;
}

const BudgetProgressRow = ({ budget, usageChange = null, actions }: BudgetProgressRowProps) => {
  const theme = useTheme();

  const backgroundColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

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
          <Typography variant="body2" color="text.secondary" dir="ltr" component="div">
            <CurrencyText value={budget.spent} variant="inherit" color="inherit" />
            {' / '}
            <CurrencyText value={budget.limit} variant="inherit" color="inherit" />
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
            backgroundColor,
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
        {actions}
      </Row>
    </Column>
  );
};

export default BudgetProgressRow;
