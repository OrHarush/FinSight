import { Divider } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import { HealthTile } from '@/hooks/business/useFinancialHealthIndicators';
import HealthIndicatorsGrid from '@/pages/Overview/MonthlyFinancialHealth/HealthIndicatorsGrid';
import MonthlyInsight from '@/pages/Overview/MonthlyFinancialHealth/variants/FullVariant/MonthlyInsight';
import { InsightKey } from '@/utils/financialHealth';

interface FullVariantProps {
  insightKey: InsightKey;
  tiles: HealthTile[];
}

const FullVariant = ({ insightKey, tiles }: FullVariantProps) => (
  <Column spacing={2} height="100%" justifyContent="center">
    <MonthlyInsight insightKey={insightKey} />
    <Divider />
    <HealthIndicatorsGrid tiles={tiles} />
  </Column>
);

export default FullVariant;
