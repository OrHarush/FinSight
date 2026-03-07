import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import axiosInstance from '@/api/axios';
import { BudgetDto } from '@/types/Budget';

interface CreateBudgetInput {
  categoryId: string;
  year: number;
  month: number;
  limit: number;
}

interface UpdateBudgetInput {
  budgetId: string;
  limit: number;
}

interface DeleteBudgetInput {
  budgetId: string;
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBudgetInput) => {
      const response = await axiosInstance.post<{ success: boolean; data: BudgetDto }>(
        API_ROUTES.BUDGETS,
        input
      );

      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets(variables.year, variables.month),
      });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId, limit }: UpdateBudgetInput) => {
      const response = await axiosInstance.put<{ success: boolean; data: BudgetDto }>(
        `${API_ROUTES.BUDGETS}/${budgetId}`,
        { limit }
      );

      return response.data.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets(data.year, data.month) });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ budgetId }: DeleteBudgetInput) => {
      const response = await axiosInstance.delete<{ success: boolean; data: BudgetDto }>(
        `${API_ROUTES.BUDGETS}/${budgetId}`
      );

      return response.data.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets(data.year, data.month) });
    },
  });
};

export const useCreateBudgetForRestOfYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBudgetInput) => {
      const currentMonth = input.month;
      const endMonth = 11;

      const promises = [];

      for (let month = currentMonth; month <= endMonth; month++) {
        promises.push(
          axiosInstance.post(API_ROUTES.BUDGETS, {
            categoryId: input.categoryId,
            year: input.year,
            month,
            limit: input.limit,
          })
        );
      }

      await Promise.all(promises);
      return input;
    },
    onSuccess: variables => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets(variables.year) });
    },
  });
};
