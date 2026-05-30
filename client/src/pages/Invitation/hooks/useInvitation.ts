import { AxiosError } from 'axios';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { InvitationPublicView } from '@/types/Workspace';

export const useInvitation = (token: string | undefined) => {
  const query = useFetch<InvitationPublicView>({
    url: token ? API_ROUTES.PUBLIC_INVITATION(token) : '',
    queryKey: queryKeys.invitation(token ?? ''),
    enabled: !!token,
  });

  const status = (query.error as AxiosError | undefined)?.response?.status;
  const isNotFound = query.isError && status === 404;

  return {
    invitation: query.data,
    isLoading: query.isLoading,
    isError: query.isError && !isNotFound,
    isNotFound,
    refetch: query.refetch,
  };
};
