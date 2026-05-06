import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useMemo } from 'react';

import api from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { RecentActivityDto, RecentActivityPageDto } from '@/types/Admin';

dayjs.extend(relativeTime);

export interface FormattedActivity extends RecentActivityDto {
  formattedTime: string;
  initials: string;
}

const PAGE_SIZE = 20;

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (name[0] ?? '').toUpperCase();
};

const formatActivityTime = (dateStr: string): string => {
  const date = dayjs(dateStr);
  const now = dayjs();

  if (now.diff(date, 'hour') < 24) {
    return date.fromNow();
  }

  return date.format('DD MMM · HH:mm');
};

const formatItem = (item: RecentActivityDto): FormattedActivity => ({
  ...item,
  formattedTime: formatActivityTime(item.createdAt),
  initials: getInitials(item.userName),
});

export const useRecentActivity = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: queryKeys.adminRecentActivity() });
    };
  }, [queryClient]);

  const query = useInfiniteQuery<RecentActivityPageDto, Error>({
    queryKey: queryKeys.adminRecentActivity(),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const url = API_ROUTES.ADMIN_RECENT_ACTIVITY(pageParam as string | undefined, PAGE_SIZE);
      const { data: apiResponse } = await api.get<ApiResponse<RecentActivityPageDto>>(url);

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Request failed');
      }

      return apiResponse.data;
    },
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  });

  const items = useMemo((): FormattedActivity[] => {
    if (!query.data) {
      return [];
    }

    return query.data.pages.flatMap(page => page.items.map(formatItem));
  }, [query.data]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
