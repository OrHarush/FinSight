import { Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';

const SharedHouseholdSkeleton = () => (
  <Column spacing={2}>
    <Skeleton variant="rounded" height={28} width="40%" />
    <Skeleton variant="rounded" height={120} />
    <Skeleton variant="rounded" height={28} width="50%" />
    <Skeleton variant="rounded" height={56} />
  </Column>
);

export default SharedHouseholdSkeleton;
