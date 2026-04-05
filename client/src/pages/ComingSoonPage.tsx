import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import logo from '@/assets/lyraIcon.webp';
import Column from '@/components/shared/layout/containers/Column';

const ComingSoonPage = () => {
  const { t } = useTranslation('common');

  return (
    <Column
      alignItems="center"
      justifyContent="center"
      spacing={4}
      sx={{
        minHeight: '100%',
        textAlign: 'center',
      }}
    >
      <img src={logo} alt="Lyra Logo" width={120} height={120} style={{ borderRadius: '12px' }} />

      <Typography variant="h3" fontWeight={600}>
        {t('comingSoon.title')}
      </Typography>
      <Typography variant="subtitle1" sx={{ maxWidth: 400 }}>
        {t('comingSoon.subtitle')}
      </Typography>
    </Column>
  );
};

export default ComingSoonPage;
