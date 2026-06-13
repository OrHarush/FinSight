import SaveIcon from '@mui/icons-material/Save';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useWatch } from 'react-hook-form';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { CategoryDto } from '@/types/Category';
import { ReviewTransactionDto } from '@/types/Transaction';

import ReviewApplyToggle from './ReviewApplyToggle';
import ReviewCategorySelect from './ReviewCategorySelect';

interface ReviewTableRowProps {
  index: number;
  transaction: ReviewTransactionDto;
  categories: CategoryDto[];
  onSaveRow: (index: number) => void;
  isSaving: boolean;
}

const ReviewTableRow = ({
  index,
  transaction,
  categories,
  onSaveRow,
  isSaving,
}: ReviewTableRowProps) => {
  const categoryId = useWatch({ name: `items.${index}.categoryId` });

  return (
    <TableRow>
      <TableCell sx={{ minWidth: 200 }}>
        <Column spacing={0.5}>
          <TextInput name={`items.${index}.name`} required />
          <Typography variant="caption" color="text.secondary">
            {transaction.sourceMerchant} · {dayjs(transaction.date).format('DD/MM/YYYY')}
          </Typography>
        </Column>
      </TableCell>
      <TableCell>
        <CurrencyText value={-transaction.amount} hasColor fontWeight={700} />
      </TableCell>
      <TableCell sx={{ minWidth: 220 }}>
        <ReviewCategorySelect name={`items.${index}.categoryId`} categories={categories} />
      </TableCell>
      <TableCell>
        <ReviewApplyToggle name={`items.${index}.applyToFuture`} />
      </TableCell>
      <TableCell>
        <IconButton
          color="primary"
          onClick={() => onSaveRow(index)}
          disabled={!categoryId || isSaving}
        >
          <SaveIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ReviewTableRow;
