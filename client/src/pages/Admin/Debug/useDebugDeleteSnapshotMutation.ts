import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';

export const useDebugDeleteSnapshotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshotId: string) => {
      await api.delete(API_ROUTES.ADMIN_DEBUG.SNAPSHOT_DELETE(snapshotId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDebugSnapshots() });
    },
  });
};
