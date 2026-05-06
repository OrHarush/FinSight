import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { AdminUserDto } from '@/types/Admin';

export const useAdminUsers = () =>
  useFetch<AdminUserDto[]>({
    url: API_ROUTES.ADMIN_USERS,
    queryKey: queryKeys.adminUsers(),
    refetchInterval: 60_000,
  });
