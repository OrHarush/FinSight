import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import api from '@/api/axios';

interface UseApiMutationProps<TData, TVariables, TError = AxiosError> {
  method: 'post' | 'put' | 'delete';
  url: string;
  queryKeysToInvalidate?: unknown[][];
  options?: UseMutationOptions<TData, TError, TVariables>;
}

export const useApiMutation = <TData = unknown, TVariables = unknown, TError = AxiosError>({
  method,
  url,
  queryKeysToInvalidate = [],
  options,
}: UseApiMutationProps<TData, TVariables, TError>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let res;

      switch (method) {
        case 'post':
          res = await api.post<TData>(url, variables);
          break;
        case 'put':
          res = await api.put<TData>(url, variables);
          break;
        case 'delete':
          res = await api.delete<TData>(url, {
            data: variables,
          } as AxiosRequestConfig);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return (res && res.data !== undefined ? res.data : null) as TData;
    },
    onSuccess: (data, variables, onMutateResult, ctx) => {
      console.log('success invalidating queries', queryKeysToInvalidate);
      queryKeysToInvalidate.forEach(async key => {
        await queryClient.invalidateQueries({ queryKey: key });
      });

      console.log('✅ Mutation successful:', { data, variables });
      options?.onSuccess?.(data, variables, onMutateResult, ctx);
    },
    ...options,
  });
};
