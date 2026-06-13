import { Paper, Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const ReviewSkeleton = () => (
  <Column spacing={1.5}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Column spacing={1.5}>
          <Row justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="50%" height={32} />
            <Skeleton variant="text" width={64} height={32} />
          </Row>
          <Skeleton variant="rounded" height={40} />
          <Row justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rounded" width={80} height={32} />
          </Row>
        </Column>
      </Paper>
    ))}
  </Column>
);

export default ReviewSkeleton;
