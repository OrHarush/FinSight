import ImportExportIcon from '@mui/icons-material/ImportExport';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useNavBarActions,
  useNavBarDate,
  usePageHeader,
} from '@/components/shared/layout/PageHeaderContext';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useExportTransactions } from '@/hooks/useExportTransactions';
import DataTransferBottomSheet from '@/pages/Transactions/DataTransferBottomSheet';
import ImportExportButtons from '@/pages/Transactions/ImportExportButtons';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';

const TransactionsHeader = () => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const [sheetOpen, setSheetOpen] = useState(false);
  const { selectedMonth, setSelectedMonth } = useTransactionPageData();
  const { mutate: exportMonth, isPending: isExporting } = useExportTransactions();
  const { transactions } = useTransactions(selectedMonth.year(), selectedMonth.month());
  const canExport = transactions.length > 0;

  usePageHeader(t('pageTitle'), true);
  useNavBarDate(selectedMonth, setSelectedMonth);

  const navBarActions = useMemo(() => {
    if (isSm) {
      return (
        <IconButton size="medium" onClick={() => setSheetOpen(true)}>
          <ImportExportIcon fontSize="small" />
        </IconButton>
      );
    }

    return <ImportExportButtons selectedMonth={selectedMonth} variant="text" />;
  }, [isSm, selectedMonth]);

  useNavBarActions(navBarActions);

  if (!isSm) {
    return null;
  }

  const onExport = () => {
    exportMonth(selectedMonth.format('YYYY-MM'), {
      onSettled: () => setSheetOpen(false),
    });
  };

  return (
    <DataTransferBottomSheet
      open={sheetOpen}
      isExporting={isExporting}
      canExport={canExport}
      onClose={() => setSheetOpen(false)}
      onExport={onExport}
    />
  );
};

export default TransactionsHeader;
