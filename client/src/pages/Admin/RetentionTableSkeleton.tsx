import { Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';

const RetentionTableSkeleton = () => (
  <Column spacing={1}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} variant="rectangular" height={40} />
    ))}
  </Column>
);

export default RetentionTableSkeleton;
