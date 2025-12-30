import { Skeleton } from '@mui/material';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';

const RecentTransactionSkeleton = () => (
  <Row height={'44px'} justifyContent="space-between" alignItems="center">
    <Row spacing={2} alignItems="center">
      <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: 1 }} />
      <Column>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={60} height={16} />
      </Column>
    </Row>
    <Skeleton variant="text" width={50} height={40} />
  </Row>
);

export default RecentTransactionSkeleton;
