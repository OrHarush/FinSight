import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import PendingInvitationRow from '@/components/features/users/SettingsModal/PendingInvitationRow';
import Column from '@/components/shared/layout/containers/Column';
import { PendingInvitationView } from '@/types/Workspace';

interface PendingInvitationsListProps {
  workspaceId: string;
  pendingInvitations: PendingInvitationView[];
}

const PendingInvitationsList = ({
  workspaceId,
  pendingInvitations,
}: PendingInvitationsListProps) => {
  const { t } = useTranslation('user');

  if (pendingInvitations.length === 0) {
    return null;
  }

  return (
    <Column spacing={1}>
      <Typography variant="subtitle2" fontWeight={600}>
        {t('sharedHousehold.pending.title')}
      </Typography>
      <Column spacing={0.75}>
        {pendingInvitations.map(inv => (
          <PendingInvitationRow
            key={inv._id}
            workspaceId={workspaceId}
            invitation={inv}
          />
        ))}
      </Column>
    </Column>
  );
};

export default PendingInvitationsList;
