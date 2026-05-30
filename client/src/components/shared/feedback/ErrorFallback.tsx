import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

import LyraPulseIcon from './LyraPulseIcon';
import {
  getDotGridStyle,
  getErrorContainerStyle,
  getErrorContentStyle,
  getErrorReloadButtonStyle,
  getErrorSubtitleStyle,
  getErrorTitleStyle,
} from './styles';

interface Props {
  onReload: () => void;
}

const ErrorFallback = ({ onReload }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <Box dir={i18n.dir()} sx={getErrorContainerStyle()}>
      <Box sx={getDotGridStyle()} />
      <Column alignItems="center" spacing={0} sx={getErrorContentStyle()}>
        <LyraPulseIcon size={180} iconSx={{ width: 100, height: 100 }} animateIcon ringColor="#7c5cff" />
        <Typography variant="h4" sx={getErrorTitleStyle()}>
          {t('errorBoundary.title')}
        </Typography>
        <Typography variant="body1" sx={getErrorSubtitleStyle()}>
          {t('errorBoundary.subtitle')}
        </Typography>
        <Button variant="contained" disableElevation onClick={onReload} sx={getErrorReloadButtonStyle()}>
          <RefreshRoundedIcon fontSize="small" />
          {t('errorBoundary.reload')}
        </Button>
      </Column>
    </Box>
  );
};

export default ErrorFallback;
