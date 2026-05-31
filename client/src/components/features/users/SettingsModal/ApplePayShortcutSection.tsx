import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getShortcutStatus,
  initShortcut,
  pollShortcutToken,
  revokeShortcut,
} from '@/api/shortcut';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { APPLE_SHORTCUT_ICLOUD_URL, SHORTCUT_TOKEN_KEY } from '@/constants/app';
import AppleLogo from './AppleLogo';

type ConnectionState = 'loading' | 'notConnected' | 'waiting' | 'connected';

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

const STEPS = [
  {
    title: 'הורד את הקיצור',
    subtitle: 'לחץ "חיבור עכשיו". הקיצור יורד לאייפון שלך',
  },
  {
    title: 'אשר את החיבור',
    subtitle: 'הקיצור יפתח את Lyra בדפדפן. אשר בלחיצה אחת',
  },
  {
    title: 'שלם ותוכל',
    subtitle: 'כל תשלום NFC יירשם אוטומטית ב-Lyra',
  },
];

const ApplePayShortcutSection = () => {
  const { t } = useTranslation('user');

  const [state, setState] = useState<ConnectionState>('loading');
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(SHORTCUT_TOKEN_KEY);

    if (!token) {
      setState('notConnected');
      return;
    }

    getShortcutStatus(token)
      .then(status => {
        setConnectedAt(status.connectedAt);
        setState('connected');
      })
      .catch(() => setState('notConnected'));
  }, []);

  useEffect(() => stopPolling, []);

  const markConnected = (token: string) => {
    stopPolling();
    localStorage.setItem(SHORTCUT_TOKEN_KEY, token);
    setConnectedAt(new Date().toISOString());
    setState('connected');
  };

  const pollOnce = (code: string) => {
    pollShortcutToken(code)
      .then(res => {
        if (res.status === 200 && 'data' in res.data) {
          markConnected(res.data.data.token);
        }
      })
      .catch(err => {
        if (err?.response?.status === 410) {
          stopPolling();
          setError(t('settingsModal.applePayShortcut.linkExpired'));
          setState('notConnected');
        }
      });
  };

  const connect = async () => {
    setError(null);

    try {
      const { code } = await initShortcut();
      window.open(APPLE_SHORTCUT_ICLOUD_URL, '_blank');
      setState('waiting');

      intervalRef.current = window.setInterval(() => pollOnce(code), POLL_INTERVAL_MS);

      timeoutRef.current = window.setTimeout(() => {
        stopPolling();
        setError(t('settingsModal.applePayShortcut.linkExpired'));
        setState('notConnected');
      }, POLL_TIMEOUT_MS);
    } catch {
      setError(t('settingsModal.applePayShortcut.connectError'));
      setState('notConnected');
    }
  };

  const disconnect = async () => {
    try {
      await revokeShortcut();
    } finally {
      localStorage.removeItem(SHORTCUT_TOKEN_KEY);
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
                {t('settingsModal.applePayShortcut.connected')}
              </Typography>
              {connectedAt && (
                <Typography variant="caption" color="text.secondary">
                  {t('settingsModal.applePayShortcut.connectedSince', {
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
            {t('settingsModal.applePayShortcut.disconnect')}
          </Button>
        </Row>
      </Paper>
    );
  }

  return (
    <Column spacing={3}>
      <Column spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AppleLogo size={24} />
        </Box>

        <Column spacing={0.5} alignItems="center" sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            חיבור Apple Pay
          </Typography>
          <Typography variant="body2" color="text.secondary">
            כל תשלום Apple Pay יירשם אוטומטית ב-Lyra, בלי לפתוח את האפליקציה
          </Typography>
        </Column>

        <Button
          variant="contained"
          fullWidth
          disabled={state === 'waiting'}
          onClick={connect}
          startIcon={
            state === 'waiting' ? (
              <CircularProgress size={16} sx={{ color: 'inherit' }} />
            ) : (
              <AppleLogo size={16} />
            )
          }
          sx={{
            bgcolor: '#000',
            color: '#fff',
            borderRadius: 2,
            py: 1.25,
            fontWeight: 600,
            '&:hover': { bgcolor: '#1a1a1a' },
            '&.Mui-disabled': { bgcolor: '#333', color: '#888' },
          }}
        >
          {state === 'waiting'
            ? t('settingsModal.applePayShortcut.waiting')
            : 'חיבור עכשיו'}
        </Button>

        {error && (
          <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Column>

      <Column spacing={1}>
        <Typography
          variant="caption"
          color="text.secondary"
          textTransform="uppercase"
          letterSpacing={0.8}
          fontSize="0.7rem"
          fontWeight={600}
        >
          איך זה עובד
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 && <Divider />}
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
                    {i + 1}
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
              </Row>
            </Fragment>
          ))}
        </Paper>
      </Column>

      <Row spacing={1} alignItems="flex-start">
        <PhoneIphoneIcon
          sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25, flexShrink: 0 }}
        />
        <Typography variant="caption" color="text.secondary">
          דורש iPhone משנת 2018 ואילך. תשלומי NFC בלבד (תשלומים אונליין לא נכללים).
        </Typography>
      </Row>
    </Column>
  );
};

export default ApplePayShortcutSection;
