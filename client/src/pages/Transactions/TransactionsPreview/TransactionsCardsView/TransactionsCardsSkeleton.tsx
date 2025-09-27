import { Box, Paper, Skeleton, Typography } from '@mui/material';

const TransactionsCardsSkeleton = () => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width={120} height={28} />
        <Box display="flex" gap={1}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
        </Box>
      </Box>
      <Skeleton variant="text" width={80} height={32} />
      <Typography variant="body2" color="text.secondary">
        <Skeleton variant="text" width={140} height={20} />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <Skeleton variant="text" width={100} height={20} />
      </Typography>
    </Paper>
  );
};

export default TransactionsCardsSkeleton;