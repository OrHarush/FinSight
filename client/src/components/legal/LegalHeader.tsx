import { Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface LegalHeaderProps {
  title: string;
}

const LegalHeader = ({ title }: LegalHeaderProps) => {
  const { t } = useTranslation('common');

  return (
    <Column spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
      <Row spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('legal.lastUpdated')}
        </Typography>
        <Chip label={t('legal.badge')} size="small" />
      </Row>
    </Column>
  );
};

export default LegalHeader;
