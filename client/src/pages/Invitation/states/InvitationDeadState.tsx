import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';
import InvitationStateBadge from '@/pages/Invitation/InvitationStateBadge';
import { InvitationPublicView } from '@/types/Workspace';

interface InvitationDeadStateProps {
  invitation: InvitationPublicView;
}

const InvitationDeadState = ({ invitation }: InvitationDeadStateProps) => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();

  return (
    <InvitationLandingShell>
      <Column spacing={2} alignItems="center" sx={{ textAlign: 'center', width: '100%' }}>
        <InvitationStateBadge icon={HistoryToggleOffRoundedIcon} tone="neutral" size={72} />
        <Typography variant="h6" fontWeight={700}>
          {invitation.workspaceName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('sharedHousehold.landing.dead.title')}
        </Typography>
      </Column>
      <Button
        variant="outlined"
        onClick={() => navigate(ROUTES.HOME_URL)}
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {t('sharedHousehold.landing.dead.backToApp')}
      </Button>
    </InvitationLandingShell>
  );
};

export default InvitationDeadState;
