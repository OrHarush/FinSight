import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Alert,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ImportPreview } from '@/pages/Import/types/importWizard';

interface UploadPreviewProps {
  preview: ImportPreview;
}

const UploadPreview = ({ preview }: UploadPreviewProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Column spacing={2}>
      <Row spacing={2} alignItems="center" flexWrap="wrap">
        <Typography variant="subtitle1" fontWeight={600}>
          {t('importWizard.upload.previewTitle')}
        </Typography>
        <Chip
          label={t('importWizard.upload.rowCount', { count: preview.rowCount })}
          color="primary"
          size="small"
        />
        {preview.dateRange && (
          <Typography variant="caption" color="text.secondary">
            {t('importWizard.upload.dateRange', {
              from: preview.dateRange.from,
              to: preview.dateRange.to,
            })}
          </Typography>
        )}
      </Row>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {t('importWizard.upload.sampleRows')}
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('importWizard.upload.col.date')}</TableCell>
              <TableCell>{t('importWizard.upload.col.name')}</TableCell>
              <TableCell style={{ textAlign: 'right' }}>{t('importWizard.upload.col.amount')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preview.sample.map((row, i) => {
              const displayAmount =
                preview.format === 'bank-statement' ? -row.amount : row.amount;

              return (
                <TableRow key={i}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>
                  <TableCell>{row.name || '—'}</TableCell>
                  <TableCell
                    style={{ textAlign: 'right' }}
                    sx={{ color: displayAmount < 0 ? 'error.main' : 'inherit' }}
                  >
                    <span dir="ltr" style={{ unicodeBidi: 'embed' }}>
                      {displayAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      {preview.warnings.length > 0 && (
        <Alert severity="warning" icon={<WarningAmberIcon />}>
          {preview.warnings.join(' ')}
        </Alert>
      )}
    </Column>
  );
};

export default UploadPreview;
