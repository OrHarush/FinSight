import { Box, Card, CardContent, Skeleton } from '@mui/material';

const KpiSkeleton = () => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="rounded" width={40} height={40} />
        <Skeleton width={100} height={20} />
      </Box>
      <Skeleton width="60%" height={48} sx={{ mb: 1 }} />
      <Skeleton width="80%" height={20} />
    </CardContent>
  </Card>
);

export default KpiSkeleton;
