import { FinancialHealthStatus, HEALTH_SEVERITY_ORDER } from '@/utils/financialHealth';

export interface HealthIndicator {
  title: string;
  value: string;
  description?: string;
  status: FinancialHealthStatus;
}

export const resolveOverallSeverity = (indicators: HealthIndicator[]): FinancialHealthStatus =>
  indicators.reduce<FinancialHealthStatus>((worst, current) => {
    const worstIndex = HEALTH_SEVERITY_ORDER.indexOf(worst);
    const currentIndex = HEALTH_SEVERITY_ORDER.indexOf(current.status);

    return currentIndex > worstIndex ? current.status : worst;
  }, 'noData');

export const isNoDataIndicator = (indicator: HealthIndicator): boolean =>
  indicator.status === 'noData';

export const hasNoData = (indicators: HealthIndicator[]): boolean =>
  indicators.length === 1 && isNoDataIndicator(indicators[0]);
