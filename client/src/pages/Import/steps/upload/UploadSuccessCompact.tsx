import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, Chip, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { FileFormat } from '@/pages/Import/types/importWizard';

interface Props {
  file: File;
  detectedFormat: FileFormat | null;
  onClear: () => void;
}

const UploadSuccessCompact = ({ file, detectedFormat, onClear }: Props) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
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
      <Column spacing={0.5}>
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
        {detectedFormat && (
          <Row sx={{ pl: 4.5 }}>
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
          </Row>
        )}
      </Column>
    </Paper>
  );
};

export default UploadSuccessCompact;
