import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';
import InvitationStateBadge from '@/pages/Invitation/InvitationStateBadge';
import { InvitationPublicView } from '@/types/Workspace';

interface InvitationAcceptedStateProps {
  invitation: InvitationPublicView;
}

const InvitationAcceptedState = ({ invitation }: InvitationAcceptedStateProps) => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();

  return (
    <InvitationLandingShell>
      <Column spacing={2} alignItems="center" sx={{ textAlign: 'center', width: '100%' }}>
        <InvitationStateBadge icon={CheckCircleRoundedIcon} tone="success" size={72} />
        <Typography variant="h6" fontWeight={700}>
          {t('sharedHousehold.landing.accepted.title', {
            household: invitation.workspaceName,
          })}
        </Typography>
      </Column>
      <Button
        variant="contained"
        onClick={() => navigate(ROUTES.OVERVIEW_URL)}
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {t('sharedHousehold.landing.accepted.enter')}
      </Button>
    </InvitationLandingShell>
  );
};

export default InvitationAcceptedState;
