import { isAxiosError } from 'axios';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';
import { AcceptInvitationResponseDto } from '@/types/Workspace';

export type AcceptInvitationErrorCode =
  | 'INVITATION_EXPIRED'
  | 'MEMBER_CAP_REACHED'
  | 'EMAIL_MISMATCH'
  | 'WORKSPACE_CAP_REACHED'
  | 'GENERIC';

const KNOWN_CODES = new Set<AcceptInvitationErrorCode>([
  'INVITATION_EXPIRED',
  'MEMBER_CAP_REACHED',
  'EMAIL_MISMATCH',
  'WORKSPACE_CAP_REACHED',
]);

export const extractAcceptErrorCode = (error: unknown): AcceptInvitationErrorCode => {
  if (!isAxiosError<{ error?: string }>(error)) {
    return 'GENERIC';
  }

  const raw = error.response?.data?.error;

  if (raw && KNOWN_CODES.has(raw as AcceptInvitationErrorCode)) {
    return raw as AcceptInvitationErrorCode;
  }

  return 'GENERIC';
};

interface UseAcceptInvitationParams {
  token: string;
  onSuccess: (workspaceId: string) => void;
  onError: (code: AcceptInvitationErrorCode) => void;
}

export const useAcceptInvitation = ({
  token,
  onSuccess,
  onError,
}: UseAcceptInvitationParams) =>
  useApiMutation<ApiResponse<AcceptInvitationResponseDto>, void>({
    method: 'post',
    url: API_ROUTES.INVITATION_ACCEPT(token),
    queryKeysToInvalidate: [queryKeys.workspaces(), queryKeys.user()],
    options: {
      onSuccess: response => {
        const workspaceId = response.data?.workspaceId;

        if (workspaceId) {
          onSuccess(workspaceId);
        }
      },
      onError: error => {
        onError(extractAcceptErrorCode(error));
      },
    },
  });
