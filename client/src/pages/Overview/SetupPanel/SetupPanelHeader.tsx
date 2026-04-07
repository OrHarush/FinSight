import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const SetupPanelHeader = () => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={1.5} alignItems={{ xs: 'center', sm: 'flex-start' }}>
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign={{ xs: 'center', sm: 'start' }}
        sx={{ lineHeight: 1.2, whiteSpace: { xs: 'pre-line', sm: 'nowrap' } }}
      >
        {t('setup.title')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign={{ xs: 'center', sm: 'start' }}
        sx={{ lineHeight: 1.7, maxWidth: 380 }}
      >
        {t('setup.subtitle')}
      </Typography>
    </Column>
  );
};

export default SetupPanelHeader;
