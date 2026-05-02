import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useNavBarDataTransfer,
  usePageHeader,
} from '@/components/shared/layout/PageHeaderContext';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useExportTransactions } from '@/hooks/useExportTransactions';
import DataTransferBottomSheet from '@/pages/Transactions/DataTransferBottomSheet';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';

const TransactionsHeader = () => {
  const { t } = useTranslation('transactions');
  const isSmallScreen = useIsSmallScreen();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { selectedMonth } = useTransactionPageData();
  const { mutate: exportMonth, isPending: isExporting } = useExportTransactions();
  const { transactions } = useTransactions(selectedMonth.year(), selectedMonth.month());
  const canExport = transactions.length > 0;

  usePageHeader(t('pageTitle'), true);
  useNavBarDataTransfer(() => setSheetOpen(true));

  if (!isSmallScreen) {
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
