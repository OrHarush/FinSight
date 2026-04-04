import { Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const UploadPreviewSkeleton = () => (
  <Column spacing={2} mt={2}>
    <Row spacing={2}>
      <Skeleton variant="rounded" width={120} height={20} />
      <Skeleton variant="rounded" width={180} height={20} />
    </Row>
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} variant="rounded" height={36} width="100%" />
    ))}
  </Column>
);

export default UploadPreviewSkeleton;
