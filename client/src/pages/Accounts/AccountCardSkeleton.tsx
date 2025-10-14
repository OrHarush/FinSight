import { Card, CardContent, Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';
import EditAndDeleteButtons from '@/components/common/EditAndDeleteButtons';

const AccountCardSkeleton = () => (
  <Card
    sx={{
      minWidth: '300px',
      width: '100%',
      height: '240px',
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Column spacing={2}>
        <Row justifyContent="space-between" alignItems="center">
          <Row alignItems="center" spacing={2}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2 }} />
            <Column>
              <Skeleton variant="text" width={120} height={28} />
              <Skeleton variant="text" width={60} height={18} />
            </Column>
          </Row>
          <Row spacing={1}>
            <EditAndDeleteButtons isDeleteDisabled={true} isEditDisabled={true} />
          </Row>
        </Row>
        <Column spacing={2}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="100%" height={20} />
        </Column>
      </Column>
    </CardContent>
  </Card>
);

export default AccountCardSkeleton;
