import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { alpha, Button, Chip, Paper, Typography, useTheme } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { FileFormat } from '@/pages/Import/types/importWizard';

import UploadSuccessCompact from './UploadSuccessCompact';

interface UploadDropzoneProps {
  file: File | null;
  isDragging: boolean;
  isLoading: boolean;
  detectedFormat: FileFormat | null;
  onProcessFile: (file: File) => void;
  onDragStateChange: (dragging: boolean) => void;
  onClear: () => void;
}

const UploadDropzone = ({
  file,
  isDragging,
  isLoading,
  detectedFormat,
  onProcessFile,
  onDragStateChange,
  onClear,
}: UploadDropzoneProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const isSmallScreen = useIsSmallScreen();
  const inputRef = useRef<HTMLInputElement>(null);

  const dropzoneBg = isDragging
    ? alpha(theme.palette.primary.main, 0.1)
    : theme.palette.background.paper;

  const dropzoneBorder = isDragging ? theme.palette.primary.main : theme.palette.divider;

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
    const picked = e.dataTransfer.files[0];

    if (picked) {
      onProcessFile(picked);
    }
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];

    if (picked) {
      onProcessFile(picked);
    }
  };

  if (file && !isLoading && isSmallScreen) {
    return <UploadSuccessCompact file={file} detectedFormat={detectedFormat} onClear={onClear} />;
  }

  return (
    <Paper
      variant="outlined"
      onDragOver={e => {
        e.preventDefault();
        onDragStateChange(true);
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={onDrop}
      sx={{
        height: '300px',
        border: `2px dashed ${dropzoneBorder}`,
        borderRadius: 3,
        backgroundColor: dropzoneBg,
        transition: 'background-color 0.15s, border-color 0.15s',
        cursor: 'pointer',
        p: 3,
        textAlign: 'center',
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.csv"
        style={{ display: 'none' }}
        onChange={onFileInput}
      />
      <Column alignItems="center" spacing={1.5}>
        <CloudUploadIcon
          sx={{ fontSize: 48, color: isDragging ? 'primary.main' : 'text.secondary' }}
        />
        <Typography variant="body1" fontWeight={500}>
          {isDragging
            ? t('importWizard.upload.dropzoneActive')
            : isSmallScreen
              ? t('importWizard.upload.dropzoneMobile')
              : t('importWizard.upload.dropzone')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('importWizard.upload.dropzoneSub')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('importWizard.upload.dropzonePrivacy')}
        </Typography>
        {!isDragging && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={e => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {file
              ? t('importWizard.upload.browseChange')
              : t('importWizard.upload.browse')}
          </Button>
        )}
        {file && !isLoading && (
          <Row spacing={1} alignItems="center" flexWrap="wrap" justifyContent="center">
            <Chip label={file.name} size="small" onDelete={onClear} />
            {detectedFormat && (
              <Chip
                label={t(
                  detectedFormat === 'bank-statement'
                    ? 'importWizard.upload.detectedFormatBankStatement'
                    : 'importWizard.upload.detectedFormatCreditCard'
                )}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: alpha(theme.palette.success.main, 0.5),
                  color: 'success.main',
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )}
          </Row>
        )}
      </Column>
    </Paper>
  );
};

export default UploadDropzone;
