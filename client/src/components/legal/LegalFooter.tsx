import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Row from '@/components/shared/layout/containers/Row';

const LegalFooter = () => {
  const { t } = useTranslation('common');

  return (
    <Row justifyContent="center" pt={2}>
      <Typography variant="body2" color="text.secondary">
        {t('legal.footer')}
      </Typography>
    </Row>
  );
};

export default LegalFooter;
