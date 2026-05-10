import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import Column from '@/components/shared/layout/containers/Column';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';
import UndoSnackbar from '@/components/shared/ui/UndoSnackbar';
import { useCategories } from '@/hooks/entities/useCategories';
import { useGhosts } from '@/hooks/entities/useGoals';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { formatGoalAmount } from '@/pages/Goals/utils/goalFormatters';
import TransactionsTotals from '@/pages/Transactions/components/TransactionsTotals';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';
import GhostTransactionCard from '@/pages/Transactions/TransactionsPreview/GhostTransactionCard';
import TransactionCard from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionCard';
import TransactionsCardsSkeleton from '@/pages/Transactions/TransactionsPreview/TransactionsCardsView/TransactionsCardsSkeleton';
import { useGhostQuickContribute } from '@/pages/Transactions/TransactionsPreview/useGhostQuickContribute';
import { TransactionPageFormValues } from '@/types/Transaction';
import type { GhostContributionDto } from '@/types/Goal';

const FALLBACK_GOAL_COLOR = '#9ca3af';

const TransactionsCardsView = () => {
  const { t: tGoals } = useTranslation('goals');
  const { t: tCommon } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [dialogGhost, setDialogGhost] = useState<GhostContributionDto | null>(null);
  const { selectedMonth, selectedCategoryIds, selectedAccountIds, selectedPaymentMethodIds } =
    useTransactionPageData();
  const { control } = useFormContext<TransactionPageFormValues>();

  const searchValue = useWatch({ control, name: 'searchValue' });
  const selectedYearMonth = useMemo(() => selectedMonth.format('YYYY-MM'), [selectedMonth]);

  const { transactions, pagination, isLoading, error, refetch } = useTransactions(
    selectedMonth.year(),
    selectedMonth.month(),
    searchValue,
    selectedCategoryIds,
    selectedAccountIds,
    selectedPaymentMethodIds,
    page,
    20
  );

  const { ghosts } = useGhosts(selectedYearMonth);
  const { categories } = useCategories();
  const {
    contribute,
    undo,
    dismiss,
    pending,
    defaultAccountId,
    defaultPaymentMethodId,
  } = useGhostQuickContribute();

  const resolveGoalColor = (categoryId: string): string =>
    categories.find(c => c._id === categoryId)?.color ?? FALLBACK_GOAL_COLOR;

  const openGhostDialog = (ghost: GhostContributionDto) => setDialogGhost(ghost);
  const closeGhostDialog = () => setDialogGhost(null);

  const pendingGhosts = useMemo(() => ghosts.filter(ghost => !ghost.satisfied), [ghosts]);

  const renderGhostCards = (ghostList: GhostContributionDto[]) =>
    ghostList.map(ghost => (
      <GhostTransactionCard
        key={`ghost-${ghost.goalId}`}
        ghost={ghost}
        color={resolveGoalColor(ghost.categoryId)}
        onLogContribution={contribute}
        onOpenDialog={openGhostDialog}
      />
    ));

  const renderOverlays = () => (
    <>
      {dialogGhost && (
        <CreateTransactionDialog
          isOpen
          closeDialog={closeGhostDialog}
          initialValues={{
            type: 'Expense',
            category: dialogGhost.categoryId,
            amount: dialogGhost.remainingAmount,
            name: tGoals('ghosts.txName', { name: dialogGhost.goalName }),
            account: defaultAccountId,
            paymentMethod: defaultPaymentMethodId,
            date: new Date().toISOString().split('T')[0],
          }}
        />
      )}
      <UndoSnackbar
        open={!!pending}
        message={
          pending
            ? tGoals('ghosts.toast.contributed', {
                amount: formatGoalAmount(pending.amount),
                name: pending.goalName,
              })
            : ''
        }
        undoLabel={tCommon('buttons.undo')}
        onUndo={undo}
        onExpire={dismiss}
      />
    </>
  );

  const { totalIncome, totalExpenses } = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'Income') acc.totalIncome += tx.amount;
      if (tx.type === 'Expense') acc.totalExpenses += tx.amount;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setPage(1);
  }, [selectedMonth, selectedCategoryIds, selectedAccountIds, selectedPaymentMethodIds]);

  if (isLoading) {
    return <TransactionsCardsSkeleton />;
  }

  if (error) {
    return <EntityError entityName="transactions" refetch={refetch} />;
  }

  if (!transactions.length && pendingGhosts.length === 0) {
    return <EntityEmpty entityName="transactions" icon={ReceiptLongIcon} />;
  }

  if (!transactions.length) {
    return (
      <Column spacing={1} overflow="hidden">
        <ScrollableColumn flex={1} sx={{ pr: 0.5 }}>
          {renderGhostCards(pendingGhosts)}
        </ScrollableColumn>
        {renderOverlays()}
      </Column>
    );
  }

  return (
    <Column spacing={1} overflow={'hidden'}>
      <TransactionsTotals totalIncome={totalIncome} totalExpenses={totalExpenses} />
      <ScrollableColumn flex={1} sx={{ pr: 0.5 }}>
        {renderGhostCards(pendingGhosts)}
        {transactions.map(tx => (
          <TransactionCard key={tx._id} transaction={tx} />
        ))}
      </ScrollableColumn>
      {pagination?.total && (
        <Box display="flex" justifyContent="center" py={2} sx={{ flexShrink: 0 }}>
          <Pagination
            count={Math.ceil(pagination.total / 20)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
      {renderOverlays()}
    </Column>
  );
};

export default TransactionsCardsView;
