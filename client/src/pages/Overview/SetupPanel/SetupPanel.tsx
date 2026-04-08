import { Grid } from '@mui/material';
import { useState } from 'react';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import LyraPulseIcon from '@/components/shared/feedback/LyraPulseIcon';
import Column from '@/components/shared/layout/containers/Column';
import { useOpen } from '@/hooks/common/useOpen';
import { useCategories } from '@/hooks/entities/useCategories';
import { resolvePresetCategory } from '@/utils/entities/category';

import AddTransactionButtons from './AddTransactionButtons';
import QuickAddPanel from './QuickAddPanel';
import SetupPanelHeader from './SetupPanelHeader';
import { QuickAddPreset } from './types';

const SetupPanel = () => {
  const [isDialogOpen, openDialog, closeDialog] = useOpen();
  const [activePreset, setActivePreset] = useState<QuickAddPreset | undefined>();
  const { categories } = useCategories();

  const openWithKey = (presetKey: string, base: Omit<QuickAddPreset, 'category'>) => {
    const categoryId = resolvePresetCategory(presetKey, categories);
    setActivePreset({ ...base, ...(categoryId && { category: categoryId }) });
    openDialog();
  };

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
            <LyraPulseIcon
              size={160}
              iconSx={{ width: { xs: 68, sm: 84 }, height: { xs: 68, sm: 84 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} order={{ xs: 2, sm: 1 }}>
            <Column spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <SetupPanelHeader />
              <QuickAddPanel openWithKey={openWithKey} />
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
            ...(activePreset?.category && { category: activePreset.category }),
          }}
        />
      )}
    </>
  );
};

export default SetupPanel;
