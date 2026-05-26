import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { UnsubscribeStatus, unsubscribeFromMarketing } from '@/api/users';
import LoadingScreen from '@/components/shared/feedback/LoadingScreen';
import LyraPulseIcon from '@/components/shared/feedback/LyraPulseIcon';
import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';

type PageState = 'loading' | UnsubscribeStatus | 'invalid';

const getStateIcon = (state: Exclude<PageState, 'loading'>) => {
  if (state === 'unsubscribed') {
    return <CheckCircleOutlineIcon sx={{ fontSize: 44, color: 'success.main' }} />;
  }

  if (state === 'already_unsubscribed') {
    return <InfoOutlinedIcon sx={{ fontSize: 44, color: 'primary.main' }} />;
  }

  return <ErrorOutlineIcon sx={{ fontSize: 44, color: 'error.main' }} />;
};

const getStateKeys = (state: Exclude<PageState, 'loading'>) => {
  if (state === 'unsubscribed') {
    return { titleKey: 'success', helperKey: 'successHelper' };
  }

  if (state === 'already_unsubscribed') {
    return { titleKey: 'alreadyUnsubscribed', helperKey: 'alreadyUnsubscribedHelper' };
  }

  return { titleKey: 'invalid', helperKey: 'invalidHelper' };
};

const UnsubscribePage = () => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('loading');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setPageState('invalid');
      return;
    }

    unsubscribeFromMarketing(token)
      .then(status => setPageState(status))
      .catch(() => setPageState('invalid'));
  }, []);

  if (pageState === 'loading') {
    return <LoadingScreen />;
  }

  const { titleKey, helperKey } = getStateKeys(pageState);
  const isSuccess = pageState !== 'invalid';

  return (
    <Column
      height="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'background.default', px: 2 }}
    >
      <Paper
        elevation={1}
        sx={{ p: 4, maxWidth: 440, width: '100%', textAlign: 'center', borderRadius: 3 }}
      >
        <Column alignItems="center" spacing={3}>
          <LyraPulseIcon size={120} />
          {getStateIcon(pageState)}
          <Column spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              {t(`unsubscribePage.${titleKey}`)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(`unsubscribePage.${helperKey}`)}
            </Typography>
          </Column>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.OVERVIEW_URL)}
            sx={{ minWidth: 140 }}
          >
            {t('unsubscribePage.backToApp')}
          </Button>
          {isSuccess && (
            <Typography variant="caption" color="text.disabled">
              {t('unsubscribePage.reEnableNote')}
            </Typography>
          )}
        </Column>
      </Paper>
    </Column>
  );
};

export default UnsubscribePage;
