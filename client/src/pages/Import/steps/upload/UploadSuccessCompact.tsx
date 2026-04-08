import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

interface Props {
  file: File;
  onClear: () => void;
}

const UploadSuccessCompact = ({ file, onClear }: Props) => {
  const { t } = useTranslation('transactions');
  const sizeKb = Math.round(file.size / 1024);

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 3,
        borderColor: 'success.main',
        bgcolor: 'transparent',
      }}
    >
      <Row alignItems="center" spacing={1.5}>
        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 22, flexShrink: 0 }} />
        <Row alignItems="baseline" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            sx={{ flex: '0 1 auto', minWidth: 0, maxWidth: '60%' }}
          >
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
            {t('importWizard.upload.fileReadySize', { size: sizeKb })}
          </Typography>
        </Row>
        <IconButton size="small" onClick={onClear} sx={{ flexShrink: 0, ml: 'auto' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Row>
    </Paper>
  );
};

export default UploadSuccessCompact;
