import { Skeleton } from '@mui/material';

import { getSkeletonStyle } from './styles';

interface QuickChipsSkeletonProps {
  count: number;
}

const QuickChipsSkeleton = ({ count }: QuickChipsSkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} variant="rounded" width={108} height={36} sx={getSkeletonStyle()} />
    ))}
  </>
);

export default QuickChipsSkeleton;
