import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { approveShortcut } from '@/api/shortcut';
import { ROUTES } from '@/constants/Routes';
import LyraIcon from '@/pages/Login/LyraIcon';
import ShortcutAuthCard from '@/pages/ShortcutAuth/ShortcutAuthCard';
import { useAuth } from '@/providers/AuthProvider';

type ApproveState = 'ready' | 'approving' | 'success' | 'error';

const ShortcutAuthPage = () => {
  const { t } = useTranslation('user');
  const { user, isLoadingUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const [state, setState] = useState<ApproveState>(code ? 'ready' : 'error');

  useEffect(() => {
    if (isLoadingUser || user) {
      return;
    }

    const next = encodeURIComponent(`${ROUTES.SHORTCUT_AUTH_URL}?code=${code ?? ''}`);
    navigate(`${ROUTES.LOGIN_URL}?next=${next}`, { replace: true });
  }, [isLoadingUser, user, code, navigate]);

  if (isLoadingUser || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const approve = async () => {
    if (!code) {
      setState('error');
      return;
    }

    setState('approving');

    try {
      await approveShortcut(code);
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <ShortcutAuthCard>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 56 }} />
        <Typography variant="h6" fontWeight={700}>
          {t('shortcutAuth.successTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('shortcutAuth.successBody')}
        </Typography>
      </ShortcutAuthCard>
    );
  }

  if (state === 'error') {
    return (
      <ShortcutAuthCard>
        <ErrorOutlineIcon color="warning" sx={{ fontSize: 56 }} />
        <Typography variant="h6" fontWeight={700}>
          {t('shortcutAuth.expiredTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('shortcutAuth.expiredBody')}
        </Typography>
      </ShortcutAuthCard>
    );
  }

  return (
    <ShortcutAuthCard>
      <LyraIcon size={64} />
      <Typography variant="h6" fontWeight={700}>
        {t('shortcutAuth.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('shortcutAuth.connectingAs')}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {user.name || user.email}
      </Typography>
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={approve}
        disabled={state === 'approving'}
        sx={{ mt: 1, borderRadius: 2 }}
      >
        {state === 'approving' ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          t('shortcutAuth.approve')
        )}
      </Button>
    </ShortcutAuthCard>
  );
};

export default ShortcutAuthPage;
