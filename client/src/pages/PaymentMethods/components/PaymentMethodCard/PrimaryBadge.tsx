import StarIcon from '@mui/icons-material/Star';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

const PrimaryBadge = () => {
  const { t } = useTranslation('paymentMethods');

  return (
    <Row spacing={0.25} alignItems="center">
      <StarIcon sx={{ fontSize: '0.8rem', color: 'primary.main' }} />
      <Typography sx={{ fontSize: '0.8rem', color: 'primary.main', fontWeight: 600 }}>
        {t('details.primary')}
      </Typography>
    </Row>
  );
};

export default PrimaryBadge;
