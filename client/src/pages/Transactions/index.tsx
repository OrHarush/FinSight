import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/Layout/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { SelectedTransactionProvider } from '@/pages/Transactions/SelectedTransactionProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import { AllInclusive, SvgIconComponent } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import Row from '@/components/Layout/Containers/Row';
import { IconButton, Tooltip } from '@mui/material';
import { ClearIcon, DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useOpen } from '@/hooks/useOpen';
import ActionFab from '@/components/ActionFab';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/UploadFile';
import CategorySelect from '@/pages/Transactions/CategorySelect';

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
        <Row spacing={2} alignItems={'flex-end'}>
          <DatePicker
            views={['month']}
            value={selectedMonth}
            onChange={newValue => setSelectedMonth(newValue)}
            slotProps={{
              textField: {
                sx: { width: 180, height: 40 },
                size: 'small',
              },
            }}
          />
          <CategorySelect
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <Tooltip title="Clear filters">
            <IconButton
              onClick={() => {
                setSelectedMonth(dayjs());
                setSelectedCategory('');
              }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Row>
        <TransactionsPreview selectedMonth={selectedMonth} selectedCategory={selectedCategory} />
        <TransactionDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          closeCreateDialog={closeCreateDialog}
        />
      </SelectedTransactionProvider>
    </PageLayout>
  );
};
