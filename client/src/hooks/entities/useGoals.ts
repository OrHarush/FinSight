import type { GoalStatusValue } from '@lyra/shared';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import type {
  GhostContributionDto,
  GoalDto,
  GoalListItemDto,
  GoalProjectionDto,
} from '@/types/Goal';

export const useGoals = (filter?: { status?: GoalStatusValue }) => {
  const params = new URLSearchParams();

  if (filter?.status) {
    params.append('status', filter.status);
  }

  const url = params.toString() ? `${API_ROUTES.GOALS}?${params.toString()}` : API_ROUTES.GOALS;

  const query = useFetch<GoalListItemDto[]>({
    url,
    queryKey: queryKeys.goals(filter),
  });

  return {
    ...query,
    goals: query.data ?? [],
  };
};

export const useGoal = (id: string | undefined) => {
  const query = useFetch<GoalDto>({
    url: id ? API_ROUTES.GOAL_BY_ID(id) : '',
    queryKey: queryKeys.goal(id ?? ''),
    enabled: Boolean(id),
  });

  return { ...query, goal: query.data };
};

export const useGoalProjection = (id: string | undefined) => {
  const query = useFetch<GoalProjectionDto>({
    url: id ? API_ROUTES.GOAL_PROJECTION(id) : '',
    queryKey: queryKeys.goalProjection(id ?? ''),
    enabled: Boolean(id),
  });

  return { ...query, projection: query.data };
};

export const useGhosts = (yearMonth: string | undefined) => {
  const query = useFetch<GhostContributionDto[]>({
    url: yearMonth ? API_ROUTES.GOAL_GHOSTS(yearMonth) : '',
    queryKey: queryKeys.goalGhosts(yearMonth ?? ''),
    enabled: Boolean(yearMonth),
  });

  return { ...query, ghosts: query.data ?? [] };
};
