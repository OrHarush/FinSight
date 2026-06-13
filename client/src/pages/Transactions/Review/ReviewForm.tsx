import { Button, useMediaQuery, useTheme } from '@mui/material';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ReviewItemPayload, useSaveReview } from '@/hooks/entities/useTransactionReview';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { CategoryDto } from '@/types/Category';
import { ReviewTransactionDto } from '@/types/Transaction';

import ReviewCardsView from './ReviewCardsView';
import ReviewEmptyState from './ReviewEmptyState';
import ReviewTableView from './ReviewTableView';

interface ReviewFormProps {
  transactions: ReviewTransactionDto[];
  categories: CategoryDto[];
}

interface ReviewRowValues {
  txId: string;
  name: string;
  categoryId: string;
  applyToFuture: boolean;
}

interface ReviewFormValues {
  items: ReviewRowValues[];
}

const toExpenseCategories = (categories: CategoryDto[]) =>
  categories.filter(category => category.type === 'Expense' || category.type === 'Savings');

const toPayload = (row: ReviewRowValues): ReviewItemPayload => ({
  id: row.txId,
  name: row.name,
  categoryId: row.categoryId,
  applyToFuture: row.applyToFuture,
});

const ReviewForm = ({ transactions, categories }: ReviewFormProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { alertSuccess, alertError } = useSnackbar();
  const saveReview = useSaveReview();

  const methods = useForm<ReviewFormValues>({
    defaultValues: {
      items: transactions.map(transaction => ({
        txId: transaction._id,
        name: transaction.name,
        categoryId: transaction.category?._id ?? '',
        applyToFuture: false,
      })),
    },
  });

  const { fields, remove } = useFieldArray({ control: methods.control, name: 'items' });

  const expenseCategories = toExpenseCategories(categories);
  const transactionById = new Map(transactions.map(transaction => [transaction._id, transaction]));

  const persist = async (rows: ReviewRowValues[]) => {
    const items = rows.filter(row => row.categoryId).map(toPayload);

    if (!items.length) {
      alertError(t('review.messages.categoryRequired'));
      return;
    }

    try {
      await saveReview.mutateAsync({ items });

      const savedIds = new Set(items.map(item => item.id));
      const indicesToRemove = methods
        .getValues('items')
        .map((row, index) => ({ row, index }))
        .filter(entry => savedIds.has(entry.row.txId))
        .map(entry => entry.index)
        .sort((a, b) => b - a);

      indicesToRemove.forEach(index => remove(index));
      alertSuccess(t('review.messages.saved'));
    } catch {
      alertError(t('review.messages.saveError'));
    }
  };

  const saveRow = (index: number) => persist([methods.getValues(`items.${index}`)]);
  const saveAll = () => persist(methods.getValues('items'));

  if (!fields.length) {
    return <ReviewEmptyState />;
  }

  const ViewComponent = isMobile ? ReviewCardsView : ReviewTableView;

  return (
    <FormProvider {...methods}>
      <Column spacing={2} sx={{ pb: 2 }}>
        <ViewComponent
          fields={fields}
          categories={expenseCategories}
          transactionById={transactionById}
          onSaveRow={saveRow}
          isSaving={saveReview.isPending}
        />
        <Row justifyContent="flex-end">
          <Button variant="contained" onClick={saveAll} disabled={saveReview.isPending}>
            {t('review.saveAll')}
          </Button>
        </Row>
      </Column>
    </FormProvider>
  );
};

export default ReviewForm;
