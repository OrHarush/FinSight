import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { AnalyticsEventType, AnalyticsOverviewDto, RecentActivityDto } from '@/types/Admin';

dayjs.extend(relativeTime);

export interface FunnelRow {
  labelKey: string;
  value: number;
  color: string;
}

export interface AdoptionRow {
  labelKey: string;
  value: number;
  color: string;
}

export interface FormattedActivity extends RecentActivityDto {
  formattedTime: string;
  initials: string;
}

const EVENT_BADGE_COLOR: Record<AnalyticsEventType, string> = {
  transaction_created: 'success',
  recurring_created: 'info',
  csv_imported: 'warning',
  category_customized: 'secondary',
  onboarding_completed: 'primary',
};

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

export const useAdminAnalytics = () => {
  const { data, isLoading, isError } = useFetch<AnalyticsOverviewDto>({
    url: `${API_ROUTES.ADMIN}/analytics`,
    queryKey: queryKeys.adminAnalytics(),
    refetchInterval: 60_000,
  });

  const funnel = useMemo((): FunnelRow[] => {
    if (!data) {
      return [];
    }

    return [
      { labelKey: 'funnel.signedUp', value: data.totalUsers, color: 'text.secondary' },
      { labelKey: 'funnel.onboarded', value: data.activatedUsers, color: 'info.main' },
      { labelKey: 'funnel.firstTx', value: data.usersWithTransactions, color: 'success.main' },
      { labelKey: 'funnel.recurringSet', value: data.eventCounts.recurring_created, color: 'warning.main' },
    ];
  }, [data]);

  const adoption = useMemo((): AdoptionRow[] => {
    if (!data) {
      return [];
    }

    return [
      { labelKey: 'adoption.transactions', value: data.eventCounts.transaction_created, color: 'text.secondary' },
      { labelKey: 'adoption.recurring', value: data.eventCounts.recurring_created, color: 'info.main' },
      { labelKey: 'adoption.csvImport', value: data.eventCounts.csv_imported, color: 'warning.main' },
      { labelKey: 'adoption.customCategories', value: data.eventCounts.category_customized, color: 'success.main' },
    ];
  }, [data]);

  const recentActivity = useMemo((): FormattedActivity[] => {
    if (!data) {
      return [];
    }

    return data.recentActivity.map(item => ({
      ...item,
      formattedTime: formatActivityTime(item.createdAt),
      initials: getInitials(item.userName),
    }));
  }, [data]);

  const adoptionMax = useMemo(() => {
    if (!adoption.length) {
      return 1;
    }

    return Math.max(...adoption.map(r => r.value), 1);
  }, [adoption]);

  const funnelMax = useMemo(() => {
    if (!funnel.length) {
      return 1;
    }

    return Math.max(funnel[0].value, 1);
  }, [funnel]);

  return {
    data,
    isLoading,
    isError,
    funnel,
    funnelMax,
    adoption,
    adoptionMax,
    recentActivity,
  };
};
