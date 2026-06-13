import Column from '@/components/shared/layout/containers/Column';

import ReviewCard from './ReviewCard';
import { ReviewViewProps } from './reviewTypes';

const ReviewCardsView = ({
  fields,
  categories,
  transactionById,
  onSaveRow,
  isSaving,
}: ReviewViewProps) => (
  <Column spacing={1.5}>
    {fields.map((field, index) => {
      const transaction = transactionById.get(field.txId);

      if (!transaction) {
        return null;
      }

      return (
        <ReviewCard
          key={field.id}
          index={index}
          transaction={transaction}
          categories={categories}
          onSaveRow={onSaveRow}
          isSaving={isSaving}
        />
      );
    })}
  </Column>
);

export default ReviewCardsView;
