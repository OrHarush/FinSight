import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

const ImportPrivacyNote = () => {
  const { t } = useTranslation('transactions');

  return (
    <Row spacing={0.5} alignItems="flex-start" justifyContent="center" sx={{ opacity: 0.7 }}>
      <LockOutlinedIcon sx={{ fontSize: '0.75rem', mt: '2px', flexShrink: 0 }} />
      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
        {t('importWizard.upload.dropzonePrivacy')}
      </Typography>
    </Row>
  );
};

export default ImportPrivacyNote;
