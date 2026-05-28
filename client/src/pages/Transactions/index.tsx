import { useMediaQuery, useTheme } from '@mui/material';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useOpen } from '@/hooks/common/useOpen';
import { useGhosts } from '@/hooks/entities/useGoals';
import { useTransactions } from '@/hooks/entities/useTransactions';
import TransactionActions from '@/pages/Transactions/TransactionActions';
import {
  TransactionPageDataProvider,
  useTransactionPageData,
} from '@/pages/Transactions/TransactionPageDataProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionsDialogs';
import TransactionsEmptyState from '@/pages/Transactions/TransactionsEmptyState';
import TransactionsFilters from '@/pages/Transactions/TransactionsFilters';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { TransactionPageFormValues } from '@/types/Transaction';

interface TransactionsBodyProps {
  openCreateDialog: () => void;
}

const TransactionsBody = ({ openCreateDialog }: TransactionsBodyProps) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const { selectedMonth, selectedCategoryIds, selectedAccountIds, selectedPaymentMethodIds } =
    useTransactionPageData();
  const { control } = useFormContext<TransactionPageFormValues>();
  const searchValue = useWatch({ control, name: 'searchValue' });

  const { transactions, isLoading: isLoadingTransactions } = useTransactions(
    selectedMonth.year(),
    selectedMonth.month()
  );
  const { ghosts, isLoading: isLoadingGhosts } = useGhosts(selectedMonth.format('YYYY-MM'));
  const isLoading = isLoadingTransactions || isLoadingGhosts;

  const hasNoFiltersActive =
    !searchValue &&
    selectedCategoryIds.length === 0 &&
    selectedAccountIds.length === 0 &&
    selectedPaymentMethodIds.length === 0;

  const isTrulyEmpty =
    !isLoading && transactions.length === 0 && ghosts.length === 0 && hasNoFiltersActive;

  if (isTrulyEmpty) {
    return (
      <>
        <TransactionsHeader />
        <TransactionsEmptyState onAddManual={openCreateDialog} />
      </>
    );
  }

  return (
    <>
      <Column height={'100%'} minHeight={0} spacing={2}>
        <TransactionsHeader />
        <Row alignItems="center" justifyContent="space-between" spacing={1}>
          <TransactionsFilters />
          {isLgUp && <TransactionActions openCreateDialog={openCreateDialog} />}
        </Row>
        <TransactionsPreview />
      </Column>
      <ActionFab onClick={openCreateDialog} showBelow={'lg'} />
    </>
  );
};

export const Transactions = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const methods = useForm<TransactionPageFormValues>();

  return (
    <PageLayout>
      <TransactionPageDataProvider>
        <FormProvider {...methods}>
          <TransactionsBody openCreateDialog={openCreateDialog} />
          <TransactionDialogs
            isCreateDialogOpen={isCreateDialogOpen}
            closeCreateDialog={closeCreateDialog}
          />
        </FormProvider>
      </TransactionPageDataProvider>
    </PageLayout>
  );
};

export default Transactions;
