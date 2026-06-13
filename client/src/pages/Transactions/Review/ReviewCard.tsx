import { Button, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  onSaveRow: (index: number) => void;
  isSaving: boolean;
}

const ReviewCard = ({ index, transaction, categories, onSaveRow, isSaving }: ReviewCardProps) => {
  const { t } = useTranslation('transactions');
  const categoryId = useWatch({ name: `items.${index}.categoryId` });

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Column spacing={1.5}>
        <Row spacing={1.5} justifyContent="space-between" alignItems="flex-start">
          <Column spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <TextInput name={`items.${index}.name`} required />
            <Typography variant="caption" color="text.secondary">
              {transaction.sourceMerchant} · {dayjs(transaction.date).format('DD/MM/YYYY')}
            </Typography>
          </Column>
          <CurrencyText value={-transaction.amount} hasColor fontWeight={700} />
        </Row>

        <ReviewCategorySelect name={`items.${index}.categoryId`} categories={categories} />

        <Row justifyContent="space-between" alignItems="center">
          <ReviewApplyToggle name={`items.${index}.applyToFuture`} />
          <Button
            variant="contained"
            size="small"
            onClick={() => onSaveRow(index)}
            disabled={!categoryId || isSaving}
          >
            {t('review.save')}
          </Button>
        </Row>
      </Column>
    </Paper>
  );
};

export default ReviewCard;
