import { useParams } from 'react-router-dom';

import { buildInvitationUrl } from '@/constants/Routes';
import { useInvitation } from '@/pages/Invitation/hooks/useInvitation';
import InvitationLoadError from '@/pages/Invitation/InvitationLoadError';
import InvitationLoadingSkeleton from '@/pages/Invitation/InvitationLoadingSkeleton';
import InvitationAcceptedState from '@/pages/Invitation/states/InvitationAcceptedState';
import InvitationDeadState from '@/pages/Invitation/states/InvitationDeadState';
import InvitationExpiredState from '@/pages/Invitation/states/InvitationExpiredState';
import InvitationGuestState from '@/pages/Invitation/states/InvitationGuestState';
import InvitationInvalidState from '@/pages/Invitation/states/InvitationInvalidState';
import InvitationMatchState from '@/pages/Invitation/states/InvitationMatchState';
import InvitationMismatchState from '@/pages/Invitation/states/InvitationMismatchState';
import { useAuth } from '@/providers/AuthProvider';

const InvitationLandingPage = () => {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const { invitation, isLoading, isError, isNotFound, refetch } = useInvitation(token);

  if (!token || isNotFound) {
    return <InvitationInvalidState />;
  }

  if (isLoading) {
    return <InvitationLoadingSkeleton />;
  }

  if (isError || !invitation) {
    return <InvitationLoadError onRetry={() => refetch()} />;
  }

  if (invitation.status === 'accepted') {
    return <InvitationAcceptedState invitation={invitation} />;
  }

  if (invitation.status === 'expired') {
    return <InvitationExpiredState invitation={invitation} />;
  }

  if (invitation.status === 'revoked' || invitation.status === 'declined') {
    return <InvitationDeadState invitation={invitation} />;
  }

  const returnTo = buildInvitationUrl(token);

  if (!user) {
    return <InvitationGuestState invitation={invitation} returnTo={returnTo} />;
  }

  const emailsMatch =
    user.email.toLowerCase() === invitation.invitedEmail.toLowerCase();

  if (!emailsMatch) {
    return (
      <InvitationMismatchState
        invitation={invitation}
        currentEmail={user.email}
        returnTo={returnTo}
      />
    );
  }

  return <InvitationMatchState invitation={invitation} token={token} />;
};

export default InvitationLandingPage;
