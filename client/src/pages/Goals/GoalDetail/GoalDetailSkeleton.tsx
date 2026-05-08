import { Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';

const GoalDetailSkeleton = () => (
  <Column spacing={2}>
    <Skeleton variant="rounded" height={56} />
    <Skeleton variant="rounded" height={80} />
    <Skeleton variant="rounded" height={92} />
    <Skeleton variant="rounded" height={300} />
    <Skeleton variant="rounded" height={180} />
  </Column>
);

export default GoalDetailSkeleton;
