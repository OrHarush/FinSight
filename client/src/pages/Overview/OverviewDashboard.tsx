import { Grid } from '@mui/material';
import { useState } from 'react';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import Column from '@/components/shared/layout/containers/Column';
import ActionFab from '@/components/shared/ui/ActionFab';
import { useOpen } from '@/hooks/common/useOpen';
import BudgetsOverview from '@/pages/Overview/BudgetsOverview';
import MonthlyFinancialHealth from '@/pages/Overview/MonthlyFinancialHealth';
import MonthlyFinancialOverview from '@/pages/Overview/MonthlyFinancialOverview';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';
import OverviewHeader from '@/pages/Overview/OverviewHeader';
import TopSpendingCategories from '@/pages/Overview/TopSpendingCategories';

const OverviewDashboard = () => {
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [initialAccountId, setInitialAccountId] = useState<string | undefined>();
  const { account } = useOverviewFilters();

  const openCreateTransaction = () => {
    setInitialAccountId(account?._id);
    openCreateDialog();
  };

  return (
    <Column height={'100%'} minHeight={0} spacing={2} sx={{ flex: 1 }}>
      <OverviewHeader />
      <Column height={'100%'} minHeight={0} spacing={4} sx={{ flex: 1 }}>
        <Grid container spacing={4} size={{ xs: 12 }}>
          <MonthlyFinancialOverview />
          <MonthlyFinancialHealth />
        </Grid>
        <Grid
          container
          size={{ xs: 12 }}
          spacing={4}
          alignItems={'stretch'}
          sx={{ flex: 1, minHeight: 0 }}
        >
          <BudgetsOverview />
          <TopSpendingCategories />
        </Grid>
      </Column>
      <ActionFab onClick={openCreateTransaction} />
      {isCreateDialogOpen && (
        <CreateTransactionDialog
          isOpen={isCreateDialogOpen}
          closeDialog={closeCreateDialog}
          initialAccountId={initialAccountId}
        />
      )}
    </Column>
  );
};

export default OverviewDashboard;
