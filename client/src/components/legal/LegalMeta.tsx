import { Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const LegalMeta = () => {
  const { t } = useTranslation('common');

  return (
    <Column spacing={2}>
      <Column spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {t('legal.contactTitle')}
        </Typography>
        <Row spacing={1}>
          <Typography fontWeight={600}>{t('legal.contactEmailLabel')}:</Typography>
          <Link href={`mailto:${t('legal.contactEmail')}`} sx={{ color: 'primary.main' }}>
            {t('legal.contactEmail')}
          </Link>
        </Row>
      </Column>
    </Column>
  );
};

export default LegalMeta;
