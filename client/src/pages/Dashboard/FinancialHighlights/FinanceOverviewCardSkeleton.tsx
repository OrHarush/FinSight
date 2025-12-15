import Column from '@/components/layout/Containers/Column';
import { Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';

const FinanceOverviewCardSkeleton = () => (
  <Column height="104px" spacing={1.5}>
    <Row spacing={2} alignItems={'center'}>
      <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2 }} />
      <Column spacing={1}>
        <Skeleton variant="rectangular" width={120} height={20} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={240} height={20} sx={{ borderRadius: 2 }} />
      </Column>
    </Row>
    <Skeleton variant="rectangular" width={240} height={28} sx={{ borderRadius: 2 }} />
  </Column>
);

export default FinanceOverviewCardSkeleton;
