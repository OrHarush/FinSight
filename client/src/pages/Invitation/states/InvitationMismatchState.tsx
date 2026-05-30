import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';
import InvitationActionablePersonHeader from '@/pages/Invitation/InvitationActionablePersonHeader';
import InvitationFooterStrip from '@/pages/Invitation/InvitationFooterStrip';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';
import { maskEmail } from '@/pages/Invitation/utils/maskEmail';
import { useAuth } from '@/providers/AuthProvider';
import { InvitationPublicView } from '@/types/Workspace';

const LYRA_PURPLE = '#534AB7';

interface InvitationMismatchStateProps {
  invitation: InvitationPublicView;
  currentEmail: string;
  returnTo: string;
}

const InvitationMismatchState = ({
  invitation,
  currentEmail,
  returnTo,
}: InvitationMismatchStateProps) => {
  const { t } = useTranslation('user');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const switchAccount = () => {
    logout();
    navigate(`${ROUTES.LOGIN_URL}?next=${encodeURIComponent(returnTo)}`);
  };

  return (
    <InvitationLandingShell
      footer={<InvitationFooterStrip invitedEmail={invitation.invitedEmail} />}
    >
      <InvitationActionablePersonHeader invitation={invitation} />
      <Column spacing={1.5} sx={{ width: '100%' }}>
        <Alert severity="warning" sx={{ width: '100%', borderRadius: 2 }}>
          {t('sharedHousehold.landing.mismatch.warning', {
            invited: maskEmail(invitation.invitedEmail),
            current: currentEmail,
          })}
        </Alert>
        <Button
          variant="contained"
          size="large"
          onClick={switchAccount}
          startIcon={<LogoutRoundedIcon />}
          sx={{
            width: '100%',
            borderRadius: 2,
            backgroundColor: LYRA_PURPLE,
            '&:hover': { backgroundColor: LYRA_PURPLE },
          }}
        >
          {t('sharedHousehold.landing.mismatch.switchAccount')}
        </Button>
      </Column>
    </InvitationLandingShell>
  );
};

export default InvitationMismatchState;
