import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
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

import finSightIconNoText from '@/assets/finSightIconNoText.webp';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIosInstallGuide } from '@/hooks/useIosInstallGuide';

const ICON_BG = '#0c0d2c';

const STEP_ICONS = [IosShareIcon, SwipeUpIcon, AddToHomeScreenIcon, CheckIcon];

const IosInstallGuideDialog = () => {
  const { t } = useTranslation('common');
  const { canShow, dismiss } = useIosInstallGuide();

  const steps = [
    { key: 'step1', Icon: STEP_ICONS[0] },
    { key: 'step2', Icon: STEP_ICONS[1] },
    { key: 'step3', Icon: STEP_ICONS[2] },
    { key: 'step4', Icon: STEP_ICONS[3] },
  ];

  return (
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
          borderRadius: '20px',
          p: 0,
          overflow: 'hidden',
          width: '380px',
          maxWidth: '380px',
        },
      }}
    >
      <IconButton
        onClick={dismiss}
        size="small"
        sx={theme => ({
          position: 'absolute',
          right: 12,
          top: 12,
          color: theme.palette.grey[500],
          zIndex: 1,
        })}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ pb: 0, pt: 3, px: 3, textAlign: 'center' }}>
        <Column spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              backgroundColor: ICON_BG,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
            }}
          >
            <Box
              component="img"
              src={finSightIconNoText}
              alt="FinSight"
              sx={{ width: 42, height: 42, objectFit: 'contain' }}
            />
          </Box>
          <Column spacing={0.5} alignItems="center">
            <Typography variant="h6" fontWeight={700} fontSize="1.1rem" lineHeight={1.2}>
              {t('iosInstallGuide.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('iosInstallGuide.subtitle')}
            </Typography>
          </Column>
        </Column>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Column spacing={1}>
          {steps.map(({ key, Icon }, index) => (
            <Row
              key={key}
              spacing={2}
              alignItems="center"
              sx={theme => ({
                borderRadius: '12px',
                px: 1.75,
                py: 1.25,
                backgroundColor: theme.palette.action.hover,
              })}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  backgroundColor: ICON_BG,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography variant="caption" fontWeight={700} color="white" lineHeight={1}>
                  {index + 1}
                </Typography>
              </Box>

              <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                {t(`iosInstallGuide.steps.${key}.title`)}
              </Typography>

              <Icon sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0 }} />
            </Row>
          ))}
        </Column>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1, justifyContent: 'center' }}>
        <Button onClick={dismiss} color="inherit" size="small" sx={{ borderRadius: '8px' }}>
          {t('iosInstallGuide.dismiss')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IosInstallGuideDialog;
