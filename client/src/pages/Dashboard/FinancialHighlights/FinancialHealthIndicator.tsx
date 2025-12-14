import { Chip, Typography } from '@mui/material';
import { calculateFinancialHealth } from '@/utils/financialHealth';
import { HEALTH_UI } from '@/utils/financialHealth';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import Row from '@/components/layout/Containers/Row';

const FinancialHealthIndicator = () => {
  const { year, month, account } = useDashboardFilters();

  const { data: monthlySummary } = useFetch<TransactionSummaryDto>({
    url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
    queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
    enabled: !!year && month >= 0 && !!account?._id,
  });

  const monthlyIncome = monthlySummary?.monthlyIncome ?? 0;
  const monthlyExpenses = monthlySummary?.monthlyExpenses ?? 0;

  const today = new Date();
  const day = today.getDate();

  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const financialHealth = calculateFinancialHealth(monthlyIncome, monthlyExpenses, today);
  const spentPercentage = monthlyIncome ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0;
  const status = financialHealth.status;

  const { label, color, Icon } = HEALTH_UI[status];

  return (
    <Chip
      icon={<Icon />}
      label={
        <Row spacing={1} alignItems="center">
          <Typography fontWeight={600}>{label}</Typography>
          <Typography sx={{ color, fontWeight: 600 }}>{spentPercentage}% spent</Typography>
          <Typography sx={{ opacity: 0.6 }}>
            · Day {day}/{totalDays}
          </Typography>
        </Row>
      }
      sx={{
        width: '320px',
        px: 1.5,
        py: 2.2,
        borderRadius: 999,
        backgroundColor: `${color}14`,
        border: `1px solid ${color}`,
        color: '#fff',
        '& .MuiChip-icon': {
          color,
        },
      }}
    />
  );
};

export default FinancialHealthIndicator;
