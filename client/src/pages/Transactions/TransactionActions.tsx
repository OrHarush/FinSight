import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useExportTransactions } from '@/hooks/useExportTransactions';
import { useTransactionPageData } from '@/pages/Transactions/TransactionPageDataProvider';

interface TransactionActionsProps {
  openCreateDialog?: () => void;
}

const TransactionActions = ({ openCreateDialog }: TransactionActionsProps) => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const { selectedMonth } = useTransactionPageData();
  const { mutate: exportMonth, isPending: isExporting } = useExportTransactions();
  const { transactions } = useTransactions(selectedMonth.year(), selectedMonth.month());
  const hasTransactions = transactions.length > 0;

  const navigateToImport = () => {
    navigate(ROUTES.IMPORT_URL);
  };

  const onExport = () => {
    exportMonth(selectedMonth.format('YYYY-MM'));
  };

  return (
    <Row spacing={1}>
      {!isSmallScreen && (
        <>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={navigateToImport}
            sx={{ width: '120px' }}
          >
            {t('actions.import')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExport}
            disabled={isExporting || !hasTransactions}
            sx={{ width: '120px' }}
          >
            {t('actions.export')}
          </Button>
        </>
      )}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openCreateDialog}
        sx={{ width: '180px' }}
      >
        {t('actions.create')}
      </Button>
    </Row>
  );
};

export default TransactionActions;
