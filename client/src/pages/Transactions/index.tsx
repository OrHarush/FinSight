import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/layout/Page/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { SelectedTransactionProvider } from '@/pages/Transactions/SelectedTransactionProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import Row from '@/components/layout/Containers/Row';
import { IconButton, Tooltip } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useOpen } from '@/hooks/useOpen';
import ActionFab from '@/components/appCommon/ActionFab';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/UploadFile';
import CategorySelect from '@/pages/Transactions/CategorySelect';
import DateSelector from '@/components/appCommon/DateSelector';
import ResponsiveRow from '@/components/layout/Containers/ResponsiveRow';

export const Transactions = () => {
  const [isCreateDialogOpen, openDialog, closeCreateDialog] = useOpen();
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <PageLayout>
      <SelectedTransactionProvider>
        <TransactionsHeader openCreateTransaction={openDialog} />
        <ActionFab
          actions={[
            { name: 'Create', icon: <AddIcon />, onClick: openDialog },
            { name: 'Import CSV', icon: <UploadIcon />, onClick: () => {} },
          ]}
        />
        <ResponsiveRow spacing={2}>
          <DateSelector value={selectedMonth} onChange={setSelectedMonth} />
          <Row spacing={2}>
            <CategorySelect
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <Tooltip title="Clear filters">
              <IconButton
                onClick={() => {
                  setSelectedCategory('');
                }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Row>
        </ResponsiveRow>
        <TransactionsPreview selectedMonth={selectedMonth} selectedCategory={selectedCategory} />
        <TransactionDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          closeCreateDialog={closeCreateDialog}
        />
      </SelectedTransactionProvider>
    </PageLayout>
  );
};
