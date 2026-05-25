import api from '@/api/axios';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { AdminSnapshotDto } from '@/types/Admin';

export const fetchAdminSnapshot = async (): Promise<AdminSnapshotDto> => {
  const { data } = await api.get<ApiResponse<AdminSnapshotDto>>(`${API_ROUTES.ADMIN}/snapshot`);

  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return data.data;
};
