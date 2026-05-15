import CookieIcon from '@mui/icons-material/Cookie';
import { Box, Button, Link, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import LegalModal from '@/components/legal/LegalModal';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useOpen } from '@/hooks/common/useOpen';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { UserDto } from '@/types/User';

import { getBannerStyle } from './styles';

interface UpdateConsentDto {
  analyticsConsent: 'accepted' | 'rejected';
}

const ConsentBanner = () => {
  const { t } = useTranslation('user');
  const { user, updateUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isPolicyOpen, openPolicy, closePolicy] = useOpen();

  const updateConsent = useApiMutation<UserDto, UpdateConsentDto>({
    method: 'patch',
    url: API_ROUTES.USERS_CONSENT,
    queryKeysToInvalidate: [queryKeys.user()],
    options: {
      onMutate: ({ analyticsConsent }) => {
        if (user) {
          updateUser({ ...user, analyticsConsent });
        }
      },
    },
  });

  if (user?.analyticsConsent !== 'pending') {
    return null;
  }

  const accept = () => updateConsent.mutate({ analyticsConsent: 'accepted' });
  const reject = () => updateConsent.mutate({ analyticsConsent: 'rejected' });

  return (
    <>
    <Paper elevation={8} sx={getBannerStyle(isMobile)} role="dialog" aria-live="polite">
      <Column spacing={isMobile ? 1.5 : 1} sx={{ flex: 1, minWidth: 0 }}>
        <Row spacing={1} alignItems="center">
          <CookieIcon fontSize="small" sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={700}>
            {t('consent.banner.title')}
          </Typography>
        </Row>
        <Typography variant="body2" color="text.secondary">
          <Trans
            i18nKey="consent.banner.body"
            ns="user"
            components={{
              policy: (
                <Link
                  component="button"
                  type="button"
                  onClick={openPolicy}
                  underline="hover"
                  color="primary"
                  sx={{ verticalAlign: 'baseline' }}
                />
              ),
            }}
          />
        </Typography>
      </Column>
      <Box
        sx={{
          flexShrink: 0,
          width: isMobile ? '100%' : 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
        }}
      >
        <Button
          onClick={reject}
          variant="outlined"
          color="inherit"
          disabled={updateConsent.isPending}
        >
          {t('consent.banner.reject')}
        </Button>
        <Button
          onClick={accept}
          variant="contained"
          disabled={updateConsent.isPending}
        >
          {t('consent.banner.accept')}
        </Button>
      </Box>
    </Paper>
    <LegalModal isOpen={isPolicyOpen} onClose={closePolicy} type="privacyPolicy" />
    </>
  );
};

export default ConsentBanner;
