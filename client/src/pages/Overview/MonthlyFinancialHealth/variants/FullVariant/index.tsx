import { Divider } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import { InsightKey } from '@/hooks/business/analyzeFinancialHealth';
import { HealthTile } from '@/hooks/business/useFinancialHealthIndicators';
import HealthIndicatorsGrid from '@/pages/Overview/MonthlyFinancialHealth/HealthIndicatorsGrid';
import MonthlyInsight from '@/pages/Overview/MonthlyFinancialHealth/variants/FullVariant/MonthlyInsight';

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
