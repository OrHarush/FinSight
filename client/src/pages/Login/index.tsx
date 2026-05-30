import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Button } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Trans, useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import login from '@/assets/login.webp';
import loginMobile from '@/assets/loginMobile.webp';
import Column from '@/components/shared/layout/containers/Column';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';
import { ROUTES } from '@/constants/Routes';
import LyraIcon from '@/pages/Login/LyraIcon';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

const isSafeInternalPath = (path: string | null): path is string =>
  !!path && path.startsWith('/') && !path.startsWith('//') && !path.includes('://');

const LoginPage = () => {
  const { t, i18n } = useTranslation('login');
  const isRtl = i18n.language === 'he';
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { alertError } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const nextParam = searchParams.get('next');
  const postLoginTarget = isSafeInternalPath(nextParam) ? nextParam : ROUTES.OVERVIEW_URL;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
        navigate(postLoginTarget);
      } catch (err) {
        console.error('Google login failed:', err);
      }
    }
  };

  if (user) {
    return <Navigate to={postLoginTarget} replace />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      paddingTop={{ xs: '25vh', md: 0 }}
      height="100%"
      sx={{
        backgroundImage: {
          xs: `url(${loginMobile})`,
          md: `url(${login})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          left: 'auto',
          zIndex: 10,
        }}
      >
        <LanguageSelect />
      </Box>
      <Button
        onClick={() => navigate(ROUTES.HOME_URL)}
        startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          color: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '100px',
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: '#fff',
          },
        }}
      >
        {t('backToHome')}
      </Button>
      <Card
        sx={{
          width: isMobile ? '88%' : '100%',
          maxWidth: '420px',
          height: 'auto',
          textAlign: 'center',
          borderRadius: 6,
          boxShadow: '0px 20px 60px rgba(0,0,0,0.6)',
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
        }}
      >
        <CardContent sx={{ py: isMobile ? 3 : 5, height: '100%' }}>
          <Column height="100%" justifyContent="space-between" spacing={isMobile ? 2 : 3}>
            <Column spacing={isMobile ? 0.5 : 1} alignItems={'center'}>
              <LyraIcon size={isMobile ? 56 : 80} />
              <Typography
                variant={isMobile ? 'h6' : 'h4'}
                fontWeight={700}
                sx={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('title')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: isMobile ? '0.95rem' : '1.1rem',
                  fontWeight: 400,
                }}
              >
                {t('subtitle')}
              </Typography>
            </Column>
            <Column spacing={2}>
              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  '& button': {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(66, 133, 244, 0.3)',
                    },
                  },
                }}
              >
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => alertError('Google login failed')}
                  shape="pill"
                  useOneTap={false}
                  ux_mode="popup"
                  width="200px"
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.75rem',
                  mt: 0.5,
                }}
              >
                <Trans
                  i18nKey="legal_acceptance"
                  t={t}
                  components={{
                    1: (
                      <a
                        href={ROUTES.TERMS_OF_SERVICE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        Terms
                      </a>
                    ),
                    2: (
                      <a
                        href={ROUTES.PRIVACY_POLICY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        Privacy
                      </a>
                    ),
                  }}
                />
              </Typography>
            </Column>
          </Column>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
