import { Paper, Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';

const AccountOverviewCardSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      padding: 2,
      borderRadius: '12px',
      width: '200px',
    }}
  >
    <Row spacing={2} alignItems="center">
      <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '12px' }} />
      <Column justifyContent="center">
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="text" width={60} height={32} />
      </Column>
    </Row>
  </Paper>
);

export default AccountOverviewCardSkeleton;
