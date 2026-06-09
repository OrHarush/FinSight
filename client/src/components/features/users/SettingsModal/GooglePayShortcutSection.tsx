import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  downloadShortcutMacro,
  getShortcutConnectionState,
  revokeShortcut,
} from '@/api/shortcut';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { MACRODROID_PLAY_STORE_URL } from '@/constants/app';

import GoogleWalletLogo from './GoogleWalletLogo';

type ConnectionState = 'loading' | 'notConnected' | 'connected';

interface MacroStep {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

const GooglePayShortcutSection = () => {
  const { t } = useTranslation('user');

  const [state, setState] = useState<ConnectionState>('loading');
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getShortcutConnectionState()
      .then(connection => {
        setConnectedAt(connection.connectedAt);
        setState(connection.connected ? 'connected' : 'notConnected');
      })
      .catch(() => setState('notConnected'));
  }, []);

  const installMacroDroid = () => {
    window.open(MACRODROID_PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const downloadMacro = async () => {
    setError(null);
    setIsDownloading(true);

    try {
      await downloadShortcutMacro();
      const connection = await getShortcutConnectionState();
      setConnectedAt(connection.connectedAt);
      setState('connected');
    } catch {
      setError(t('settingsModal.googlePayShortcut.downloadError'));
    } finally {
      setIsDownloading(false);
    }
  };

  const disconnect = async () => {
    try {
      await revokeShortcut();
    } finally {
      setConnectedAt(null);
      setState('notConnected');
    }
  };

  if (state === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (state === 'connected') {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}>
        <Row spacing={2} alignItems="center" justifyContent="space-between">
          <Row spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                flexShrink: 0,
              }}
            />
            <Column spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600}>
                {t('settingsModal.googlePayShortcut.connected')}
              </Typography>
              {connectedAt && (
                <Typography variant="caption" color="text.secondary">
                  {t('settingsModal.googlePayShortcut.connectedSince', {
                    date: dayjs(connectedAt).format('DD/MM/YYYY'),
                  })}
                </Typography>
              )}
            </Column>
          </Row>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={disconnect}
            sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            {t('settingsModal.googlePayShortcut.disconnect')}
          </Button>
        </Row>
      </Paper>
    );
  }

  const steps: MacroStep[] = [
    {
      title: t('settingsModal.googlePayShortcut.step1Title'),
      subtitle: t('settingsModal.googlePayShortcut.step1Subtitle'),
      action: (
        <Button
          variant="outlined"
          size="small"
          onClick={installMacroDroid}
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {t('settingsModal.googlePayShortcut.install')}
        </Button>
      ),
    },
    {
      title: t('settingsModal.googlePayShortcut.step2Title'),
      subtitle: t('settingsModal.googlePayShortcut.step2Subtitle'),
      action: (
        <Button
          variant="contained"
          size="small"
          onClick={downloadMacro}
          disabled={isDownloading}
          startIcon={
            isDownloading ? (
              <CircularProgress size={14} sx={{ color: 'inherit' }} />
            ) : (
              <DownloadIcon sx={{ fontSize: 16 }} />
            )
          }
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {t('settingsModal.googlePayShortcut.download')}
        </Button>
      ),
    },
    {
      title: t('settingsModal.googlePayShortcut.step3Title'),
      subtitle: t('settingsModal.googlePayShortcut.step3Subtitle'),
    },
  ];

  return (
    <Column spacing={3}>
      <Column spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <GoogleWalletLogo size={32} />
        </Box>

        <Column spacing={0.5} alignItems="center" sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('settingsModal.googlePayShortcut.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('settingsModal.googlePayShortcut.description')}
          </Typography>
        </Column>
      </Column>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {steps.map((step, index) => (
          <Fragment key={step.title}>
            {index > 0 && <Divider />}
            <Row
              spacing={1.5}
              alignItems="center"
              sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'action.selected',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography variant="caption" fontWeight={700} lineHeight={1}>
                  {index + 1}
                </Typography>
              </Box>
              <Column sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} fontSize="0.95rem">
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                  {step.subtitle}
                </Typography>
              </Column>
              {step.action}
            </Row>
          </Fragment>
        ))}
      </Paper>

      {error && (
        <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Column>
  );
};

export default GooglePayShortcutSection;
