import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import HouseholdContextCard from '@/pages/Invitation/HouseholdContextCard';
import InviterAvatar from '@/pages/Invitation/InviterAvatar';
import { InvitationPublicView } from '@/types/Workspace';

interface InvitationActionablePersonHeaderProps {
  invitation: InvitationPublicView;
}

const InvitationActionablePersonHeader = ({
  invitation,
}: InvitationActionablePersonHeaderProps) => {
  const { t } = useTranslation('user');

  return (
    <Column spacing={2} alignItems="center" sx={{ width: '100%' }}>
      <InviterAvatar
        name={invitation.inviterName}
        picture={invitation.inviterPicture}
        size={64}
      />
      <Column spacing={0.5} alignItems="center" sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: 'text.primary' }}>
          {t('sharedHousehold.landing.inviteHeadline', { inviter: invitation.inviterName })}
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
          {t('sharedHousehold.landing.inviteSubtitle')}
        </Typography>
      </Column>
      <HouseholdContextCard
        name={invitation.workspaceName}
        color={invitation.workspaceColor}
      />
    </Column>
  );
};

export default InvitationActionablePersonHeader;
