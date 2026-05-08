import { Box, Skeleton } from '@mui/material';

const GoalsSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      gap: 2,
    }}
  >
    {[0, 1, 2].map(i => (
      <Skeleton key={i} variant="rounded" height={180} />
    ))}
  </Box>
);

export default GoalsSkeleton;
