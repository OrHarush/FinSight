import { HealthStatus } from '@/utils/financialHealth';

export interface HealthIndicator {
  title: string;
  value: string;
  description?: string;
  status: HealthStatus;
}

export const isNoDataIndicator = (indicator: HealthIndicator): boolean =>
  indicator.status === 'noData';

export const hasNoData = (indicators: HealthIndicator[]): boolean =>
  indicators.length === 1 && isNoDataIndicator(indicators[0]);
