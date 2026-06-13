import { useTranslation } from 'react-i18next';

import { usePageHeader } from '@/components/shared/layout/PageHeaderContext';
import { useReviewList } from '@/hooks/entities/useTransactionReview';

import ReviewEmptyState from './ReviewEmptyState';
import ReviewForm from './ReviewForm';
import ReviewSkeleton from './ReviewSkeleton';

const TransactionsReview = () => {
  const { t } = useTranslation('transactions');
  usePageHeader(t('review.pageTitle'));

  const { data, isLoading } = useReviewList();

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  const transactions = data?.transactions ?? [];
  const categories = data?.categories ?? [];

  if (!transactions.length) {
    return <ReviewEmptyState />;
  }

  return (
    <ReviewForm
      key={transactions.map(transaction => transaction._id).join(',')}
      transactions={transactions}
      categories={categories}
    />
  );
};

export default TransactionsReview;
