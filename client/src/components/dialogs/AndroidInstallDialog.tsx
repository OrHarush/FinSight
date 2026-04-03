import BoltIcon from '@mui/icons-material/Bolt';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import finSightIcon from '@/assets/finSightIcon.webp';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useMobileInstallation } from '@/hooks/installation/useMobileInstallation';

const AndroidInstallDialog = () => {
  const { t } = useTranslation('common');
  const { canShow, install, dismiss } = useMobileInstallation();

  const handleInstall = async () => {
    await install();
  };

  return (
    canShow && (
      <Dialog
        open={canShow}
        onClose={dismiss}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(2px)',
            },
          },
        }}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            p: 0,
            overflow: 'hidden',
            width: '400px',
            maxWidth: '400px',
            height: '360px',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <IconButton
          onClick={dismiss}
          size="small"
          sx={theme => ({
            position: 'absolute',
            right: 10,
            top: 10,
            color: theme.palette.grey[500],
            zIndex: 1,
          })}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Column height={'100%'} justifyContent={'space-between'}>
          <DialogTitle sx={{ pb: 0, pt: 2, px: 2.5, textAlign: 'center', flexShrink: 0 }}>
            <Column spacing={1} alignItems="center">
              <Box
                component="img"
                src={finSightIcon}
                alt="FinSight"
                sx={{ width: 56, height: 56, objectFit: 'contain' }}
              />
              <Typography variant="h6" fontWeight={700} fontSize="1.05rem" lineHeight={1.2}>
                {t('installPrompt.title')}
              </Typography>
            </Column>
          </DialogTitle>
          <DialogContent
            sx={{
              px: 3,
              py: 2,
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Column spacing={3}>
              <Row spacing={1.5} alignItems="center">
                <BoltIcon sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('installPrompt.reasons.speed')}
                </Typography>
              </Row>
              <Row spacing={1.5} alignItems="center">
                <PhoneAndroidIcon sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  {t('installPrompt.reasons.accessibility')}
                </Typography>
              </Row>
              <Row spacing={1.5} alignItems="center">
                <WifiOffIcon sx={{ fontSize: 20, color: 'text.disabled', flexShrink: 0 }} />
                <Typography variant="body2" color="text.disabled" sx={{ flexShrink: 1 }}>
                  {t('installPrompt.reasons.offline')}
                </Typography>
              </Row>
            </Column>
          </DialogContent>

          <DialogActions
            sx={{ px: 2.5, pb: 2, pt: 0, gap: 1, justifyContent: 'center', flexShrink: 0 }}
          >
            <Button onClick={dismiss} color="inherit" size="small" sx={{ borderRadius: '8px' }}>
              {t('installPrompt.later')}
            </Button>
            <Button
              onClick={handleInstall}
              variant="contained"
              size="small"
              endIcon={<DownloadIcon />}
              sx={{ borderRadius: '8px' }}
            >
              {t('installPrompt.install')}
            </Button>
          </DialogActions>
        </Column>
      </Dialog>
    )
  );
};

export default AndroidInstallDialog;
