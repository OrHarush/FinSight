import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) return false;
        return failureCount < 2;
      },
    },
  },
});
