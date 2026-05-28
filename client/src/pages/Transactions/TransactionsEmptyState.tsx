import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import UploadIcon from '@mui/icons-material/Upload';
import { Box, Button, Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ImportPrivacyNote from '@/components/features/transactions/ImportPrivacyNote';
import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';

interface TransactionsEmptyStateProps {
  onAddManual: () => void;
}

const TransactionsEmptyState = ({ onAddManual }: TransactionsEmptyStateProps) => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();

  const onImport = () => navigate(ROUTES.IMPORT_URL);

  return (
    <Column alignItems="center" justifyContent="center" spacing={3} flex={1} sx={{ p: 3 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
        }}
      >
        <ReceiptLongIcon sx={{ fontSize: 32, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ textAlign: 'center' }}>
        {t('getStartedEmpty.title')}
      </Typography>
      <ResponsiveRow
        spacing={2}
        alignItems="stretch"
        sx={{ width: '100%', maxWidth: 720 }}
      >
        <Card
          variant="outlined"
          sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}
        >
          <Row spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('getStartedEmpty.manual.title')}
            </Typography>
            <AddIcon fontSize="small" color="action" />
          </Row>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('getStartedEmpty.manual.description')}
          </Typography>
          <Button variant="outlined" onClick={onAddManual} fullWidth>
            {t('getStartedEmpty.manual.cta')}
          </Button>
        </Card>
        <Card
          variant="outlined"
          sx={{
            flex: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            borderColor: 'primary.main',
          }}
        >
          <Row spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t('getStartedEmpty.import.title')}
            </Typography>
            <UploadIcon fontSize="small" color="primary" />
          </Row>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('getStartedEmpty.import.description')}
          </Typography>
          <Button variant="contained" onClick={onImport} fullWidth>
            {t('getStartedEmpty.import.cta')}
          </Button>
          <Box sx={{ mt: 1.5 }}>
            <ImportPrivacyNote />
          </Box>
        </Card>
      </ResponsiveRow>
    </Column>
  );
};

export default TransactionsEmptyState;
