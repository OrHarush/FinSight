import { useOpen } from '@/hooks/useOpen';
import TransactionsHeader from '@/pages/Transactions/TransactionsHeader';
import PageLayout from '@/components/Layout/PageLayout';
import TransactionsPreview from '@/pages/Transactions/TransactionsPreview';
import { SelectedTransactionProvider } from '@/pages/Transactions/SelectedTransactionProvider';
import TransactionDialogs from '@/pages/Transactions/TransactionDialogs';
import { useCategories } from '@/providers/EntitiesProviders/CategoriesProvider';
import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import Row from '@/components/Layout/Containers/Row';
import { IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import { ClearIcon, DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { Dayjs } from 'dayjs';

export const Transactions = () => {
  const [isCreateDialogOpen, openDialog, closeCreateDialog] = useOpen();
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories } = useCategories();

  return (
    <PageLayout>
      <SelectedTransactionProvider>
        <TransactionsHeader openCreateTransaction={openDialog} />
        <Row spacing={2} alignItems={'flex-end'}>
          <DatePicker
            views={['year', 'month']}
            value={selectedMonth}
            onChange={newValue => setSelectedMonth(newValue)}
            slotProps={{
              textField: {
                sx: { width: 180, height: 40 }, // match Select width
                size: 'small', // reduce padding
              },
            }}
          />
          <Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            sx={{ width: '180px' }}
          >
            {categories.map(category => {
              const IconComponent =
                (category.icon && (Icons as Record<string, SvgIconComponent>)[category.icon]) ||
                CategoryIcon;

              return (
                <MenuItem key={category._id} value={category._id}>
                  <Row spacing={1}>
                    <IconComponent sx={{ color: category.color }} />
                    <Typography>{category.name}</Typography>
                  </Row>
                </MenuItem>
              );
            })}
          </Select>
          <Tooltip title="Clear filters">
            <IconButton
              onClick={() => {
                setSelectedMonth(null);
                setSelectedCategory(null);
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
