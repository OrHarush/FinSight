import { Box, Divider, Grid, Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import MonthlyFinancialHealthCard from '@/pages/Overview/MonthlyFinancialHealth/MonthlyFinancialHealthCard';

const MonthlyFinancialHealthSkeleton = () => (
  <MonthlyFinancialHealthCard>
    <Column spacing={2} height="100%" justifyContent="center">
      <Column spacing={0.5}>
        <Skeleton variant="text" width={160} height={32} />
        <Skeleton variant="text" width={220} height={24} />
      </Column>
      <Divider />
      <Grid container spacing={1.5}>
        {[1, 2].map(i => (
          <Grid key={i} size={{ xs: 6 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.selected',
                height: '100%',
              }}
            >
              <Column spacing={0.75}>
                <Skeleton variant="text" width={80} height={18} />
                <Skeleton variant="text" width={100} height={26} />
                <Skeleton variant="text" width={120} height={16} />
              </Column>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Column>
  </MonthlyFinancialHealthCard>
);

export default MonthlyFinancialHealthSkeleton;
