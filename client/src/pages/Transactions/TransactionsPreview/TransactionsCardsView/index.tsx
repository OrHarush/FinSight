import { useEffect, useState } from 'react';
import { Box, Pagination } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import EntityError from '@/components/entities/EntityError';
import EntityEmpty from '@/components/entities/EntityEmpty';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useTranslation } from 'react-i18next';
import { TransactionDto } from '@/types/Transaction';
import DeletionConfirmationDialog from '@/components/dialogs/DeletionConfirmationDialog';

interface TransactionsCardsViewProps {
  selectedMonth: Dayjs | null;
  selectedCategory: string | null;
}

const TransactionsCardsView = ({ selectedMonth, selectedCategory }: TransactionsCardsViewProps) => {
  const { t } = useTranslation('transactions');
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto | null>(null);
  const { alertSuccess, alertError } = useSnackbar();

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    dayjs().year(),
    selectedMonth?.month(),
    selectedCategory ?? undefined,
    page
  );

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTransaction = useApiMutation<void, { id: string }>({
    method: 'delete',
    buildUrl: ({ id }) => `${API_ROUTES.TRANSACTIONS}/${id}`,
    queryKeysToInvalidate: [queryKeys.transactions()],
    options: {
      onSuccess: () => {
        alertSuccess(t('messages.deleteSuccess'));
      },
      onError: err => {
        alertError(t('messages.deleteError'));
        console.error('❌ Failed to delete transaction', err);
      },
    },
  });

  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedCategory]);

  if (isLoading) {
    return <TransactionsCardsSkeleton />;
  }

  if (error) {
    return <EntityError entityName="transactions" refetch={refetch} />;
  }

  if (!transactions.length) {
    return <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />;
  }

  return (
    <Box display="flex" flexDirection="column">
      {transactions.map(tx => (
        <TransactionCard
          key={tx._id}
          transaction={tx}
          onRequestDelete={() => setSelectedTransaction(tx)}
        />
      ))}
      {pagination?.total && (
        <Box display="flex" justifyContent="center" py={2}>
          <Pagination
            count={Math.ceil(pagination.total / 20)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
      <DeletionConfirmationDialog
        isOpen={!!selectedTransaction}
        closeDialog={() => setSelectedTransaction(null)}
        onConfirm={() => {
          if (selectedTransaction) {
            deleteTransaction.mutate({ id: selectedTransaction._id });
          }
        }}
        entityType="transaction"
      />
    </Box>
  );
};

export default TransactionsCardsView;
