import Column from '@/components/layout/Containers/Column';
import { Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';

const FinanceOverviewCardSkeleton = () => (
  <Row width="100%" justifyContent="space-between" alignItems="center">
    <Column spacing={1}>
      <Skeleton variant="rectangular" width={120} height={20} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 2 }} />
    </Column>
    <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
  </Row>
);

export default FinanceOverviewCardSkeleton;
