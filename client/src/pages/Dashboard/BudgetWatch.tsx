import { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Grid,
  useTheme,
} from '@mui/material';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';

const BudgetWatch = () => {
  const theme = useTheme();
  const { year, month } = useDashboardFilters();
  const { categories } = useCategories();
  const { transactions } = useTransactions(year, month);

  const watchedBudgets = useMemo(() => {
    if (!categories || !transactions) return [];

    const spentMap = new Map<string, number>();

    transactions.forEach(tx => {
      if (tx.category?.type === 'Expense') {
        spentMap.set(tx.category._id, (spentMap.get(tx.category._id) ?? 0) + tx.amount);
      }
    });

    return categories
      .filter(c => c.monthlyLimit && c.monthlyLimit > 0)
      .map(c => {
        const spent = spentMap.get(c._id) ?? 0;
        const limit = c.monthlyLimit!;
        const percent = (spent / limit) * 100;

        return {
          id: c._id,
          name: c.name,
          spent,
          limit,
          percent,
        };
      })
      .filter(c => c.percent >= 70)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);
  }, [categories, transactions]);

  const getBarColor = (percent: number) => {
    if (percent >= 90) return theme.palette.error.main;
    if (percent >= 75) return theme.palette.warning.main;
    return theme.palette.grey[600];
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Budget Watch
          </Typography>

          {watchedBudgets.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              All budgets on track
            </Typography>
          ) : (
            <Stack spacing={2.5}>
              {watchedBudgets.map(cat => {
                const percentColor =
                  cat.percent >= 90
                    ? 'error.main'
                    : cat.percent >= 80
                      ? 'warning.main'
                      : 'text.secondary';

                return (
                  <Column key={cat.id} spacing={0.5}>
                    <Typography variant="body2" fontWeight={500}>
                      {cat.name}
                    </Typography>
                    <Column>
                      <Row justifyContent={'space-between'}>
                        <Typography variant="caption" color="text.secondary">
                          ₪{cat.spent.toLocaleString()} / ₪{cat.limit.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" fontWeight={700} color={percentColor}>
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
            </Stack>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BudgetWatch;
