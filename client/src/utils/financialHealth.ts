import { SvgIconComponent } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export type FinancialHealthStatus = 'excellent' | 'onTrack' | 'risk' | 'critical';

export interface FinancialHealthResult {
  ratio: number;
  status: FinancialHealthStatus;
}

export function calculateFinancialHealth(
  income: number,
  expensesSoFar: number,
  today: Date
): FinancialHealthResult {
  if (income <= 0 && expensesSoFar > 0) {
    return { ratio: 1, status: 'critical' };
  }

  const day = today.getDate();
  const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const rawExpected = income * (day / totalDays);
  const minExpected = income * 0.05;
  const expectedExpenses = Math.max(rawExpected, minExpected);

  const ratio = expensesSoFar / expectedExpenses;
  const remainingBudget = income - expensesSoFar;
  const earlyMonthBonus = day <= 3 ? 0.1 : 0;

  if (remainingBudget < 0) {
    return { ratio, status: 'critical' };
  }

  if (ratio <= 0.85 + earlyMonthBonus) {
    return { ratio, status: 'excellent' };
  }

  if (ratio <= 1.05) {
    return { ratio, status: 'onTrack' };
  }

  if (ratio <= 1.5) {
    return { ratio, status: 'risk' };
  }

  return { ratio, status: 'risk' };
}

export const HEALTH_UI: Record<
  FinancialHealthStatus,
  {
    color: string;
    Icon: SvgIconComponent;
  }
> = {
  excellent: {
    color: '#22c55e',
    Icon: TrendingUpIcon,
  },
  onTrack: {
    color: '#6c5ce7',
    Icon: CheckCircleOutlineIcon,
  },
  risk: {
    color: '#f59e0b',
    Icon: WarningAmberIcon,
  },
  critical: {
    color: '#ef4444',
    Icon: ErrorOutlineIcon,
  },
};
