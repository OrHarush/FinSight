import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

import LyraPulseIcon from './LyraPulseIcon';
import { getDotGridStyle, getLoadingContainerStyle, getSubtitleStyle } from './styles';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <Box sx={getLoadingContainerStyle()}>
      <Box sx={getDotGridStyle()} />
      <Column alignItems="center" spacing={0} sx={{ position: 'relative', zIndex: 1 }}>
        <LyraPulseIcon size={200} iconSx={{ width: 110, height: 110 }} animateIcon />
        <Typography variant="body2" sx={{ mt: 5, ...getSubtitleStyle() }}>
          {t('loading')}
        </Typography>
      </Column>
    </Box>
  );
};

export default LoadingScreen;
