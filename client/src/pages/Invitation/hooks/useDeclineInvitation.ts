import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';

interface UseDeclineInvitationParams {
  token: string;
  onSuccess: () => void;
  onError: () => void;
}

export const useDeclineInvitation = ({
  token,
  onSuccess,
  onError,
}: UseDeclineInvitationParams) =>
  useApiMutation<unknown, void>({
    method: 'post',
    url: API_ROUTES.INVITATION_DECLINE(token),
    queryKeysToInvalidate: [queryKeys.invitation(token)],
    options: {
      onSuccess: () => onSuccess(),
      onError: () => onError(),
    },
  });
