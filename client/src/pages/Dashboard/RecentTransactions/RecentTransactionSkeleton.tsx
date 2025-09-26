import { Skeleton } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import Column from '@/components/Layout/Containers/Column';

const RecentTransactionSkeleton = () => {
  return (
    <Row justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
      <Row spacing={2} alignItems="center">
        <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
        <Column>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={60} height={16} />
        </Column>
      </Row>
      <Skeleton variant="text" width={50} height={20} />
    </Row>
  );
};

export default RecentTransactionSkeleton;
