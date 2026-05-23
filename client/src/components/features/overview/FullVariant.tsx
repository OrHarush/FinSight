import { Divider } from '@mui/material';

import HealthIndicatorsGrid from '@/components/features/overview/HealthIndicatorsGrid';
import MonthlyInsight from '@/components/features/overview/MonthlyInsight';
import Column from '@/components/shared/layout/containers/Column';
import { InsightKey } from '@/hooks/business/analyzeFinancialHealth';
import { HealthTile } from '@/hooks/business/useFinancialHealthIndicators';

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
