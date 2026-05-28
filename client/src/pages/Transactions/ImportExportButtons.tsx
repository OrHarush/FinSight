import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { Button } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useExportTransactions } from '@/hooks/useExportTransactions';

interface ImportExportButtonsProps {
  selectedMonth: Dayjs;
  variant?: 'outlined' | 'text';
}

const ImportExportButtons = ({ selectedMonth, variant = 'outlined' }: ImportExportButtonsProps) => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const { mutate: exportMonth, isPending: isExporting } = useExportTransactions();
  const { transactions } = useTransactions(selectedMonth.year(), selectedMonth.month());
  const hasTransactions = transactions.length > 0;

  const navigateToImport = () => {
    navigate(ROUTES.IMPORT_URL);
  };

  const onExport = () => {
    exportMonth(selectedMonth.format('YYYY-MM'));
  };

  const buttonSx = variant === 'outlined' ? { width: '120px' } : undefined;
  const rowSx = variant === 'text' ? { marginInlineStart: 2 } : undefined;

  return (
    <Row spacing={1} sx={rowSx}>
      <Button
        variant={variant}
        startIcon={<UploadIcon />}
        onClick={navigateToImport}
        sx={buttonSx}
      >
        {t('actions.import')}
      </Button>
      <Button
        variant={variant}
        startIcon={<DownloadIcon />}
        onClick={onExport}
        disabled={isExporting || !hasTransactions}
        sx={buttonSx}
      >
        {t('actions.export')}
      </Button>
    </Row>
  );
};

export default ImportExportButtons;
