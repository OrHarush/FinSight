import { Grid } from '@mui/material';
import { useState } from 'react';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import Column from '@/components/shared/layout/containers/Column';
import { useOpen } from '@/hooks/common/useOpen';
import AddTransactionButtons from '@/pages/Overview/SetupPanel/AddTransactionButtons';
import QuickAddPanel from '@/pages/Overview/SetupPanel/QuickAddPanel';
import SetupPanelHeader from '@/pages/Overview/SetupPanel/SetupPanelHeader';

import SetupPanelVisual from './SetupPanelVisual';
import { QuickAddPreset } from './types';

const SetupPanel = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();
  const [activePreset, setActivePreset] = useState<QuickAddPreset | undefined>();

  const openWithPreset = (preset: QuickAddPreset) => {
    setActivePreset(preset);
    openDialog();
  };

  return (
    <>
      <Column
        width="100%"
        minHeight="70vh"
        justifyContent="center"
        alignItems="center"
        sx={{ px: { xs: 2, sm: 4 }, py: { xs: 4, sm: 6 } }}
      >
        <Grid
          container
          spacing={{ xs: 4, sm: 8 }}
          alignItems="center"
          justifyContent="center"
          sx={{ maxWidth: 1000, width: '100%' }}
        >
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
            order={{ xs: 1, sm: 2 }}
          >
            <SetupPanelVisual onCardClick={openWithPreset} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} order={{ xs: 2, sm: 1 }}>
            <Column spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <SetupPanelHeader />
              <QuickAddPanel openWithPreset={openWithPreset} />
              <AddTransactionButtons openWithPreset={openWithPreset} />
            </Column>
          </Grid>
        </Grid>
      </Column>

      {isDialogOpen && (
        <CreateTransactionDialog
          isOpen={isDialogOpen}
          closeDialog={closeDialog}
          initialType={activePreset?.type ?? 'Expense'}
          initialValues={{
            type: activePreset?.type ?? 'Expense',
            ...(activePreset?.name && { name: activePreset.name }),
            ...(activePreset?.amount && { amount: activePreset.amount }),
          }}
        />
      )}
    </>
  );
};

export default SetupPanel;
