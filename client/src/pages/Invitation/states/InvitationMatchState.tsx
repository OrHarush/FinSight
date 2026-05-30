import { Alert, Button, Link } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useAcceptInvitation, AcceptInvitationErrorCode } from '@/pages/Invitation/hooks/useAcceptInvitation';
import { useDeclineInvitation } from '@/pages/Invitation/hooks/useDeclineInvitation';
import InvitationActionablePersonHeader from '@/pages/Invitation/InvitationActionablePersonHeader';
import InvitationFooterStrip from '@/pages/Invitation/InvitationFooterStrip';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';
import InvitationSocialProof from '@/pages/Invitation/InvitationSocialProof';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { InvitationPublicView } from '@/types/Workspace';

const LYRA_PURPLE = '#534AB7';

interface InvitationMatchStateProps {
  invitation: InvitationPublicView;
  token: string;
}

const errorTranslationKey = (code: AcceptInvitationErrorCode): string => {
  switch (code) {
    case 'INVITATION_EXPIRED':
      return 'sharedHousehold.landing.acceptErrors.expired';
    case 'MEMBER_CAP_REACHED':
      return 'sharedHousehold.landing.acceptErrors.memberCap';
    case 'EMAIL_MISMATCH':
      return 'sharedHousehold.landing.acceptErrors.emailMismatch';
    case 'WORKSPACE_CAP_REACHED':
      return 'sharedHousehold.landing.acceptErrors.workspaceCap';
    default:
      return 'sharedHousehold.landing.acceptErrors.generic';
  }
};

const InvitationMatchState = ({ invitation, token }: InvitationMatchStateProps) => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useSnackbar();
  const [acceptError, setAcceptError] = useState<AcceptInvitationErrorCode | null>(null);

  const accept = useAcceptInvitation({
    token,
    onSuccess: () => {
      alertSuccess(
        t('sharedHousehold.landing.acceptSuccess', { household: invitation.workspaceName })
      );
      navigate(ROUTES.OVERVIEW_URL);
    },
    onError: code => setAcceptError(code),
  });

  const decline = useDeclineInvitation({
    token,
    onSuccess: () => {
      alertSuccess(t('sharedHousehold.landing.match.declineSuccess'));
      navigate(ROUTES.OVERVIEW_URL);
    },
    onError: () => alertError(t('sharedHousehold.landing.match.declineError')),
  });

  const isPending = accept.isPending || decline.isPending;

  const triggerAccept = () => {
    setAcceptError(null);
    accept.mutate();
  };

  return (
    <InvitationLandingShell
      footer={<InvitationFooterStrip invitedEmail={invitation.invitedEmail} />}
    >
      <InvitationActionablePersonHeader invitation={invitation} />
      {acceptError && (
        <Alert severity="warning" sx={{ width: '100%', borderRadius: 2 }}>
          {t(errorTranslationKey(acceptError), { inviter: invitation.inviterName })}
        </Alert>
      )}
      <Column spacing={1.5} sx={{ width: '100%' }}>
        <InvitationSocialProof
          inviterName={invitation.inviterName}
          inviterPicture={invitation.inviterPicture}
        />
        <Button
          variant="contained"
          size="large"
          onClick={triggerAccept}
          disabled={isPending}
          sx={{
            width: '100%',
            borderRadius: 2,
            backgroundColor: LYRA_PURPLE,
            '&:hover': { backgroundColor: LYRA_PURPLE },
          }}
        >
          {t('sharedHousehold.landing.match.accept')}
        </Button>
        <Row justifyContent="center">
          <Link
            component="button"
            type="button"
            variant="caption"
            color="text.secondary"
            underline="hover"
            disabled={isPending}
            onClick={() => decline.mutate()}
            sx={{
              cursor: isPending ? 'default' : 'pointer',
              opacity: isPending ? 0.5 : 1,
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              fontSize: '0.75rem',
            }}
          >
            {t('sharedHousehold.landing.declineLink')}
          </Link>
        </Row>
      </Column>
    </InvitationLandingShell>
  );
};

export default InvitationMatchState;
