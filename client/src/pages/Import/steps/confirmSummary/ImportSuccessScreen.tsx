import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface ImportResultSummary {
  inserted: number;
  skipped: number;
  failed: number;
}

interface ImportSuccessScreenProps {
  result: ImportResultSummary;
  onGoToTransactions: () => void;
  onImportAnother: () => void;
}

const ImportSuccessScreen = ({
  result,
  onGoToTransactions,
  onImportAnother,
}: ImportSuccessScreenProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Column flex={1} alignItems="center" justifyContent="center" spacing={3}>
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main' }} />
      <Column alignItems="center" spacing={1}>
        <Typography variant="h5" fontWeight={600}>
          {t('importWizard.confirm.success.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('importWizard.confirm.success.importedCount', { count: result.inserted })}
        </Typography>
        {result.skipped > 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.confirm.success.skippedCount', { count: result.skipped })}
          </Typography>
        )}
        {result.failed > 0 && (
          <Typography variant="body2" color="error">
            {t('importWizard.confirm.success.failedCount', { count: result.failed })}
          </Typography>
        )}
      </Column>
      <Row spacing={1.5} justifyContent="center">
        <Button variant="contained" onClick={onGoToTransactions}>
          {t('importWizard.confirm.success.goToTransactions')}
        </Button>
        <Button variant="outlined" onClick={onImportAnother}>
          {t('importWizard.confirm.success.importAnother')}
        </Button>
      </Row>
    </Column>
  );
};

export default ImportSuccessScreen;
