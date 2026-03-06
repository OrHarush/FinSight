import { Skeleton } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';

const CategoriesLoadingSkeleton = () => (
  <Column spacing={2} sx={{ p: 2 }}>
    {Array.from({ length: 4 }).map((_, idx) => (
      <Skeleton key={idx} variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
    ))}
  </Column>
);

export default CategoriesLoadingSkeleton;
