import { Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';

const InvitationLoadingSkeleton = () => (
  <InvitationLandingShell>
    <Column spacing={2} alignItems="center" sx={{ width: '100%' }}>
      <Skeleton variant="circular" width={64} height={64} />
      <Skeleton variant="text" width="70%" height={28} />
      <Skeleton variant="text" width="55%" height={20} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
    </Column>
  </InvitationLandingShell>
);

export default InvitationLoadingSkeleton;
