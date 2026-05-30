import { useQueryClient } from '@tanstack/react-query';

import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';

interface LeaveWorkspaceResponseDto {
  deleted: boolean;
}

interface UseLeaveWorkspaceParams {
  workspaceId: string;
  onSuccess: (result: LeaveWorkspaceResponseDto) => void;
  onError: () => void;
}

export const useLeaveWorkspace = ({
  workspaceId,
  onSuccess,
  onError,
}: UseLeaveWorkspaceParams) => {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse<LeaveWorkspaceResponseDto>, void>({
    method: 'post',
    url: API_ROUTES.WORKSPACE_LEAVE(workspaceId),
    options: {
      onSuccess: async response => {
        await queryClient.invalidateQueries();

        if (response.data) {
          onSuccess(response.data);
        }
      },
      onError: () => onError(),
    },
  });
};
