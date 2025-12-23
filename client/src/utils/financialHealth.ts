import { SvgIconComponent } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export type FinancialHealthStatus = 'noData' | 'ok' | 'warning' | 'critical';

export const HEALTH_SEVERITY_ORDER: FinancialHealthStatus[] = [
  'noData',
  'ok',
  'warning',
  'critical',
];

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

  if (remainingBudget < 0) {
    return { ratio, status: 'critical' };
  }

  if (ratio <= 1.05) {
    return { ratio, status: 'ok' };
  }

  if (ratio <= 1.5) {
    return { ratio, status: 'warning' };
  }

  return { ratio, status: 'critical' };
}
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const HEALTH_UI: Record<FinancialHealthStatus, { color: string; Icon: SvgIconComponent }> = {
  noData: {
    color: '#64748b',
    Icon: HelpOutlineIcon,
  },
  ok: {
    color: '#22c55e',
    Icon: CheckCircleOutlineIcon,
  },
  warning: {
    color: '#f59e0b',
    Icon: WarningAmberIcon,
  },
  critical: {
    color: '#ef4444',
    Icon: ErrorOutlineIcon,
  },
};
