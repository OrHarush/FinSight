import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import api from '@/api/axios';

interface UseApiMutationProps<TData, TVariables, TError = AxiosError> {
  method: 'post' | 'put' | 'delete';
  url?: string;
  buildUrl?: (variables: TVariables) => string; // NEW
  queryKeysToInvalidate?: unknown[][];
  options?: UseMutationOptions<TData, TError, TVariables>;
}

export const useApiMutation = <TData = unknown, TVariables = unknown, TError = AxiosError>({
  method,
  url,
  buildUrl,
  queryKeysToInvalidate = [],
  options,
}: UseApiMutationProps<TData, TVariables, TError>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const requestUrl = buildUrl ? buildUrl(variables) : url;

      if (!requestUrl) {
        throw new Error('No URL provided for mutation');
      }

      let res;

      switch (method) {
        case 'post':
          res = await api.post<TData>(requestUrl, variables);
          break;
        case 'put':
          res = await api.put<TData>(requestUrl, variables);
          break;
        case 'delete':
          res = await api.delete<TData>(requestUrl, {
            data: variables,
          } as AxiosRequestConfig);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return (res && res.data !== undefined ? res.data : null) as TData;
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, ctx) => {
      queryKeysToInvalidate.forEach(async key => {
        await queryClient.invalidateQueries({ queryKey: key });
      });

      options?.onSuccess?.(data, variables, onMutateResult, ctx);
    },
  });
};
