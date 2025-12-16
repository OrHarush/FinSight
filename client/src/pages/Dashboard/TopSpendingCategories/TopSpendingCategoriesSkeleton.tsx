import { Card, Grid, Skeleton, Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';

const TopSpendingCategoriesSkeleton = () => (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '620px', padding: 4 }}>
        <Column spacing={2}>
          <Typography variant="h6" gutterBottom>
            Top Spending Categories
          </Typography>
          <Skeleton variant="rectangular" height={64} width={280} sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={64} width={150} sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={64} width={230} sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={64} width={310} sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rectangular" height={64} width={100} sx={{ borderRadius: '8px' }} />
        </Column>
      </Card>
    </Grid>
  );

export default TopSpendingCategoriesSkeleton;