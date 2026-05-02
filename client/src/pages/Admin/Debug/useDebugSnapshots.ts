import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { DebugSnapshotDto } from '@/types/AdminDebug';

export const useDebugSnapshots = () =>
  useFetch<DebugSnapshotDto[]>({
    url: API_ROUTES.ADMIN_DEBUG.SNAPSHOTS,
    queryKey: queryKeys.adminDebugSnapshots(),
  });
