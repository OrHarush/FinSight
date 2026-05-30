import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';
import InvitationActionablePersonHeader from '@/pages/Invitation/InvitationActionablePersonHeader';
import InvitationFooterStrip from '@/pages/Invitation/InvitationFooterStrip';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';
import InvitationSocialProof from '@/pages/Invitation/InvitationSocialProof';
import { InvitationPublicView } from '@/types/Workspace';

const LYRA_PURPLE = '#534AB7';

interface InvitationGuestStateProps {
  invitation: InvitationPublicView;
  returnTo: string;
}

const InvitationGuestState = ({ invitation, returnTo }: InvitationGuestStateProps) => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate(`${ROUTES.LOGIN_URL}?next=${encodeURIComponent(returnTo)}`);
  };

  return (
    <InvitationLandingShell
      footer={<InvitationFooterStrip invitedEmail={invitation.invitedEmail} />}
    >
      <InvitationActionablePersonHeader invitation={invitation} />
      <Column spacing={1.5} sx={{ width: '100%' }}>
        <InvitationSocialProof
          inviterName={invitation.inviterName}
          inviterPicture={invitation.inviterPicture}
        />
        <Button
          variant="contained"
          size="large"
          onClick={goToLogin}
          sx={{
            width: '100%',
            borderRadius: 2,
            backgroundColor: LYRA_PURPLE,
            '&:hover': { backgroundColor: LYRA_PURPLE },
          }}
        >
          {t('sharedHousehold.landing.guest.loginCta')}
        </Button>
      </Column>
    </InvitationLandingShell>
  );
};

export default InvitationGuestState;
