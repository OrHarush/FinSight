import { Skeleton, Box } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';

const BudgetsSkeleton = () => (
  <Column spacing={2}>
    {Array.from({ length: 5 }).map((_, idx) => (
      <Box
        key={idx}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={6}
              sx={{ mt: 1, borderRadius: 1 }}
            />
          </Box>
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </Box>
    ))}
  </Column>
);

export default BudgetsSkeleton;
