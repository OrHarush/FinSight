import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import api from '@/api/axios';
import Column from '@/components/shared/layout/containers/Column';
import { API_ROUTES } from '@/constants/Routes';
import { ImportPreview, useImportWizard, WizardRow } from '@/pages/Import/ImportWizardContext';
import UploadDropzone from '@/pages/Import/steps/upload/UploadDropzone';
import UploadPreview from '@/pages/Import/steps/upload/UploadPreview';
import UploadPreviewSkeleton from '@/pages/Import/steps/upload/UploadPreviewSkeleton';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.xlsx', '.csv'];

const resolveErrorKey = (message: string): string => {
  if (message.includes('Unsupported file type')) {
    return 'importWizard.upload.error.unsupported';
  }

  if (
    message.includes('No valid rows') ||
    message.includes('empty') ||
    message.includes('Could not detect')
  ) {
    return 'importWizard.upload.error.noData';
  }

  if (message.includes('parse') || message.includes('column')) {
    return 'importWizard.upload.error.parse';
  }

  return 'importWizard.upload.error.generic';
};

const UploadStep = () => {
  const { t } = useTranslation('transactions');
  const { setFile, setPreview, setRows, setCanProceed, file, preview } = useImportWizard();

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (preview && preview.rowCount > 0) {
      setCanProceed(true);
    }
  }, [preview, setCanProceed]);

  const processFile = async (picked: File) => {
    const ext = picked.name.slice(picked.name.lastIndexOf('.')).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorKey('importWizard.upload.error.unsupported');
      return;
    }

    if (picked.size > MAX_FILE_SIZE) {
      setErrorKey('importWizard.upload.error.generic');
      return;
    }

    setFile(picked);
    setErrorKey(null);
    setIsLoading(true);
    setCanProceed(false);

    try {
      const body = new FormData();
      body.append('file', picked);

      const { data: res } = await api.post<{
        success: boolean;
        data: ImportPreview;
        error?: string;
      }>(API_ROUTES.IMPORT_PREVIEW, body);

      const result = res.data;

      if (result.rowCount === 0) {
        setErrorKey('importWizard.upload.error.noData');
        return;
      }

      setPreview(result);
      setRows(
        result.sample.map((row): WizardRow => ({ ...row, selected: true, categoryId: null }))
      );
      setCanProceed(true);
    } catch (err: unknown) {
      const msg =
        err !== null &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { error?: string } } }).response?.data?.error
          ? (err as { response: { data: { error: string } } }).response.data.error
          : '';
      setErrorKey(resolveErrorKey(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null as never);
    setCanProceed(false);
  };

  return (
    <Column spacing={3} flex={1}>
      <UploadDropzone
        file={file}
        isDragging={isDragging}
        isLoading={isLoading}
        onProcessFile={processFile}
        onDragStateChange={setIsDragging}
        onClear={clearFile}
      />
      {errorKey && (
        <Alert severity="error" icon={<WarningAmberIcon />} onClose={() => setErrorKey(null)}>
          {t(errorKey)}
        </Alert>
      )}
      {isLoading && <UploadPreviewSkeleton />}
      {!isLoading && preview && preview.rowCount > 0 && <UploadPreview preview={preview} />}
    </Column>
  );
};

export default UploadStep;
