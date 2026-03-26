import { Grid } from '@mui/material';

import HealthIndicatorCell from '@/pages/Overview/MonthlyFinancialHealth/HealthIndicatorCell';
import { HealthIndicator } from '@/utils/healthIndicatorUtils';

interface HealthIndicatorsGridProps {
  indicators: HealthIndicator[];
  isNoDataState: boolean;
}

const HealthIndicatorsGrid = ({ indicators, isNoDataState }: HealthIndicatorsGridProps) => (
  <>
    {indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, sm: isNoDataState ? 12 : 4 }} textAlign="center">
        <HealthIndicatorCell
          title={indicator.title}
          value={indicator.value}
          description={indicator.description}
        />
      </Grid>
    ))}
  </>
);

export default HealthIndicatorsGrid;
