import { useQueryClient } from '@tanstack/react-query';

import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';

interface SetActiveWorkspacePayload {
  workspaceId: string;
}

interface UseSetActiveWorkspaceParams {
  onSuccess: (workspaceId: string) => void;
  onError: () => void;
}

export const useSetActiveWorkspace = ({
  onSuccess,
  onError,
}: UseSetActiveWorkspaceParams) => {
  const queryClient = useQueryClient();

  return useApiMutation<
    ApiResponse<{ activeWorkspaceId: string }>,
    SetActiveWorkspacePayload
  >({
    method: 'patch',
    url: API_ROUTES.USERS_ACTIVE_WORKSPACE,
    options: {
      onSuccess: async (_response, variables) => {
        await queryClient.invalidateQueries();
        onSuccess(variables.workspaceId);
      },
      onError: () => onError(),
    },
  });
};
