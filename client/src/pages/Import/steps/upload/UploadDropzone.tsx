import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { alpha, Button, Chip, Paper, Typography, useTheme } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

interface UploadDropzoneProps {
  file: File | null;
  isDragging: boolean;
  isLoading: boolean;
  onProcessFile: (file: File) => void;
  onDragStateChange: (dragging: boolean) => void;
  onClear: () => void;
}

const UploadDropzone = ({
  file,
  isDragging,
  isLoading,
  onProcessFile,
  onDragStateChange,
  onClear,
}: UploadDropzoneProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
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
        height: '260px',
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
            : t('importWizard.upload.dropzone')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('importWizard.upload.dropzoneSub')}
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
            {t('importWizard.upload.browse')}
          </Button>
        )}
        {file && !isLoading && (
          <Chip label={file.name} size="small" onDelete={onClear} />
        )}
      </Column>
    </Paper>
  );
};

export default UploadDropzone;
