import { ElementType } from 'react';
import { LinearProgress, Typography, useTheme } from '@mui/material';
import * as Icons from '@mui/icons-material';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface BudgetItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
  spent: number;
  limit: number;
  percent: number;
}

interface BudgetListProps {
  budgets: BudgetItem[];
}

const BudgetList = ({ budgets }: BudgetListProps) => {
  const theme = useTheme();

  const getBarColor = (percent: number) => {
    if (percent >= 90) return theme.palette.error.main;
    if (percent >= 75) return theme.palette.warning.main;
    return theme.palette.grey[600];
  };

  const getPercentColor = (percent: number) => {
    if (percent >= 90) return 'error.main';
    if (percent >= 80) return 'warning.main';
    return 'text.secondary';
  };

  return (
    <ScrollableColumn spacing={2} maxHeight={400}>
      {budgets.map(cat => {
        const Icon = (Icons as Record<string, ElementType>)[cat.icon] || Icons.Category;

        return (
          <Column key={cat.id} spacing={0.5}>
            <Row spacing={1} alignItems={'center'}>
              <Icon
                sx={{
                  width: 20,
                  height: 20,
                  color: cat.color ?? theme.palette.text.secondary,
                }}
              />
              <Typography variant="body2" fontWeight={500}>
                {cat.name}
              </Typography>
            </Row>
            <Column>
              <Row justifyContent={'space-between'}>
                <Typography variant="caption" color="text.secondary">
                  ₪{cat.spent.toLocaleString()} / ₪{cat.limit.toLocaleString()}
                </Typography>
                <Typography variant="caption" fontWeight={700} color={getPercentColor(cat.percent)}>
                  {cat.percent.toFixed(0)}%
                </Typography>
              </Row>
              <LinearProgress
                variant="determinate"
                value={Math.min(cat.percent, 100)}
                sx={{
                  height: 10,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getBarColor(cat.percent),
                  },
                }}
              />
            </Column>
          </Column>
        );
      })}
    </ScrollableColumn>
  );
};

export default BudgetList;
