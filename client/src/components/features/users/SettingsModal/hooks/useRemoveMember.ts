import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';

interface UseRemoveMemberParams {
  workspaceId: string;
  userId: string;
  onSuccess: () => void;
  onError: () => void;
}

export const useRemoveMember = ({
  workspaceId,
  userId,
  onSuccess,
  onError,
}: UseRemoveMemberParams) =>
  useApiMutation<unknown, void>({
    method: 'delete',
    url: API_ROUTES.WORKSPACE_MEMBER(workspaceId, userId),
    queryKeysToInvalidate: [queryKeys.workspaces()],
    options: {
      onSuccess: () => onSuccess(),
      onError: () => onError(),
    },
  });
