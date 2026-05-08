import type { CreateGoalDTO, UpdateGoalDTO } from '@lyra/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from '@/api/axios';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import type { GoalDto } from '@/types/Goal';

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGoalDTO) => {
      const response = await axiosInstance.post<{ success: boolean; data: GoalDto }>(
        API_ROUTES.GOALS,
        input
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allGoals() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allGoalGhosts() });
    },
  });
};

interface UpdateGoalInput {
  goalId: string;
  patch: UpdateGoalDTO;
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, patch }: UpdateGoalInput) => {
      const response = await axiosInstance.patch<{ success: boolean; data: GoalDto }>(
        API_ROUTES.GOAL_BY_ID(goalId),
        patch
      );

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allGoals() });
      queryClient.invalidateQueries({ queryKey: queryKeys.goal(variables.goalId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goalProjection(variables.goalId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allGoalGhosts() });
    },
  });
};

interface DeleteGoalInput {
  goalId: string;
  keepCategory: boolean;
}

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, keepCategory }: DeleteGoalInput) => {
      await axiosInstance.delete(API_ROUTES.GOAL_DELETE(goalId, keepCategory));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allGoals() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allGoalGhosts() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allTransactions() });
    },
  });
};
