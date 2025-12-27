import { Skeleton, Grid } from '@mui/material';
import MonthlyFinancialHealthCard from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthCard';

const MonthlyFinancialHealthSkeleton = () => (
  <MonthlyFinancialHealthCard>
    <Grid height={'100%'} container alignItems={'center'}>
      <Grid size={{ xs: 12, sm: 3, md: 12, lg: 3 }} justifyItems={'center'}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={80}
          sx={{ minWidth: 80, minHeight: 80, borderRadius: 5 }}
        />
      </Grid>
      <Grid container size={{ xs: 12, sm: 9, md: 12, lg: 9 }} justifyItems={'center'}>
        {[1, 2, 3].map(i => (
          <Grid key={i} size={{ xs: 4 }} justifyItems={'center'}>
            <Skeleton variant="text" width={60} height={22} />
            <Skeleton variant="text" width={90} height={28} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  </MonthlyFinancialHealthCard>
);

export default MonthlyFinancialHealthSkeleton;
