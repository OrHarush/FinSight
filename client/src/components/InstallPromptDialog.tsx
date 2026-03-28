import GetAppIcon from '@mui/icons-material/GetApp';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const InstallPromptDialog = () => {
  const { t } = useTranslation('common');
  const { canShow, install } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);

  const isOpen = canShow && !isDismissed;

  const dismissDialog = () => {
    setIsDismissed(true);
  };

  const handleInstall = async () => {
    await install();
    setIsDismissed(true);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={dismissDialog}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(1px)',
          },
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          paddingY: 1,
          paddingX: 1,
        },
      }}
    >
      <DialogTitle>
        <Row spacing={1} alignItems="center">
          <GetAppIcon sx={{ fontSize: 26, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
            {t('installPrompt.title')}
          </Typography>
        </Row>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {t('installPrompt.body')}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 1 }}>
        <Button onClick={dismissDialog} color="inherit">
          {t('installPrompt.later')}
        </Button>
        <Button onClick={handleInstall} variant="contained" startIcon={<GetAppIcon />}>
          {t('installPrompt.install')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstallPromptDialog;
