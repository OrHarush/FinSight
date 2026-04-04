import { FormProvider, useForm } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import TransactionActions from '@/pages/Transactions/TransactionActions';
import { TransactionPageDataProvider } from '@/pages/Transactions/TransactionPageDataProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionsDialogs';
import TransactionsFilters from '@/pages/Transactions/TransactionsFilters';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';

export const Transactions = () => {
  const isMobile = useIsMobile();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const methods = useForm();

  return (
    <PageLayout>
      <TransactionPageDataProvider>
        <FormProvider {...methods}>
          <Column height={'100%'} minHeight={0} spacing={2}>
            <TransactionsHeader />
            <Row alignItems="center" justifyContent="space-between" spacing={1}>
              <TransactionsFilters />
              {!isMobile && <TransactionActions openCreateDialog={openCreateDialog} />}
            </Row>
            <TransactionsPreview />
          </Column>
          <ActionFab onClick={openCreateDialog} showBelow={'sm'} />
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
