import { TableCell, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';

import TextInput from '@/components/shared/inputs/TextInput';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { CategoryDto } from '@/types/Category';
import { ReviewTransactionDto } from '@/types/Transaction';

import ReviewApplyCheckbox from './ReviewApplyCheckbox';
import ReviewCategorySelect from './ReviewCategorySelect';

interface ReviewTableRowProps {
  index: number;
  transaction: ReviewTransactionDto;
  categories: CategoryDto[];
}

const ReviewTableRow = ({ index, transaction, categories }: ReviewTableRowProps) => (
  <TableRow>
    <TableCell>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        {dayjs(transaction.date).format('DD/MM/YYYY')}
      </Typography>
    </TableCell>
    <TableCell sx={{ minWidth: 200 }}>
      <TextInput name={`items.${index}.name`} required hiddenLabel size="small" />
    </TableCell>
    <TableCell align="center">
      <CurrencyText value={-transaction.amount} hasColor fontWeight={700} />
    </TableCell>
    <TableCell sx={{ minWidth: 220 }}>
      <ReviewCategorySelect name={`items.${index}.categoryId`} categories={categories} />
    </TableCell>
    <TableCell align="center">
      <ReviewApplyCheckbox name={`items.${index}.applyToFuture`} />
    </TableCell>
  </TableRow>
);

export default ReviewTableRow;
