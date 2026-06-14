import { Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { CategoryDto } from '@/types/Category';
import { ReviewTransactionDto } from '@/types/Transaction';

import ReviewApplyToggle from './ReviewApplyToggle';
import ReviewCategorySelect from './ReviewCategorySelect';

interface ReviewCardProps {
  index: number;
  transaction: ReviewTransactionDto;
  categories: CategoryDto[];
}

const ReviewCard = ({ index, transaction, categories }: ReviewCardProps) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
    <Column spacing={1.5}>
      <Typography variant="caption" color="text.secondary">
        {dayjs(transaction.date).format('DD/MM/YYYY')}
      </Typography>

      <Row spacing={1.5} justifyContent="space-between" alignItems="center">
        <TextInput name={`items.${index}.name`} required hiddenLabel size="small" />
        <CurrencyText value={-transaction.amount} hasColor fontWeight={700} />
      </Row>

      <ReviewCategorySelect name={`items.${index}.categoryId`} categories={categories} />

      <ReviewApplyToggle name={`items.${index}.applyToFuture`} />
    </Column>
  </Paper>
);

export default ReviewCard;
