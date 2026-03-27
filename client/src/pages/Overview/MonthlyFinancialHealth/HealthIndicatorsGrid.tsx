import { Grid } from '@mui/material';

import { HealthTile } from '@/hooks/business/useFinancialHealthIndicators';
import HealthIndicatorCell from '@/pages/Overview/MonthlyFinancialHealth/HealthIndicatorCell';

interface HealthIndicatorsGridProps {
  tiles: HealthTile[];
}

const HealthIndicatorsGrid = ({ tiles }: HealthIndicatorsGridProps) => (
  <Grid container spacing={1.5} sx={{ width: '100%' }}>
    {tiles.map((tile, idx) => (
      <Grid key={idx} size={{ xs: tiles.length === 1 ? 12 : 6 }}>
        <HealthIndicatorCell tile={tile} />
      </Grid>
    ))}
  </Grid>
);

export default HealthIndicatorsGrid;
