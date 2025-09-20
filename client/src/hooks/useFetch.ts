import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/api/axios';

interface UseFetchProps<TData, TError = AxiosError> {
  url: string;
  queryKey: unknown[];
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export const useFetch = <TData, TError = AxiosError>({
  url,
  queryKey,
  onSuccess,
  onError,
}: UseFetchProps<TData, TError>) => {
  const query = useQuery<TData, TError>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await api.get<TData>(url);

      return res.data;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  useEffect(() => {
    if (query.isError && query.error && onError) {
      onError(query.error);
    }
  }, [query.isError, query.error, onError]);

  return query;
};
