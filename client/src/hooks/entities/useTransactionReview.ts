import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';
import { CategoryDto } from '@/types/Category';
import { ReviewTransactionDto } from '@/types/Transaction';

interface ReviewCountResponse {
  count: number;
}

interface ReviewListResponse {
  transactions: ReviewTransactionDto[];
  categories: CategoryDto[];
}

export interface ReviewItemPayload {
  id: string;
  name: string;
  categoryId: string;
  applyToFuture: boolean;
}

export const useReviewCount = (enabled = true) =>
  useFetch<ReviewCountResponse>({
    url: API_ROUTES.TRANSACTIONS_REVIEW_COUNT,
    queryKey: queryKeys.transactionsReviewCount(),
    enabled,
  });

export const useReviewList = () =>
  useFetch<ReviewListResponse>({
    url: API_ROUTES.TRANSACTIONS_REVIEW,
    queryKey: queryKeys.transactionsReview(),
  });

export const useSaveReview = () =>
  useApiMutation<unknown, { items: ReviewItemPayload[] }>({
    method: 'post',
    url: API_ROUTES.TRANSACTIONS_REVIEW,
    queryKeysToInvalidate: [
      queryKeys.transactionsReview(),
      queryKeys.transactionsReviewCount(),
      queryKeys.allTransactions(),
    ],
  });
