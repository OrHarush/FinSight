import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import finSightIcon from '@/assets/finSightIconNoText.webp';
import Column from '@/components/shared/layout/containers/Column';

import {
  getDotGridStyle,
  getIconStyle,
  getLoadingContainerStyle,
  getRingStyle,
  getSubtitleStyle,
} from './styles';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <Box sx={getLoadingContainerStyle()}>
      <Box sx={getDotGridStyle()} />
      <Column alignItems="center" spacing={0} sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            position: 'relative',
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={getRingStyle(0)} />
          <Box sx={getRingStyle(0.6)} />
          <Box sx={getRingStyle(1.2)} />
          <Box component="img" src={finSightIcon} alt="FinSight" sx={getIconStyle()} />
        </Box>

        <Typography variant="body2" sx={{ mt: 5, ...getSubtitleStyle() }}>
          {t('loading')}
        </Typography>
      </Column>
    </Box>
  );
};

export default LoadingScreen;
