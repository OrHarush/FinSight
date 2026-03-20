import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Button } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import login from '@/assets/login.webp';
import vaultImage from '@/assets/loginVault.webp';
import loginMobileImage from '@/assets/mobileLoginBackground.webp';
import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';
import FinSightIcon from '@/pages/Login/FinSightIcon';
import LegalLinks from '@/pages/Login/LegalLinks';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

const LoginPage = () => {
  const { t, i18n } = useTranslation('login');
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { alertError } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isRtl = i18n.language === 'he';

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
        navigate(ROUTES.OVERVIEW_URL);
      } catch (err) {
        console.error('Google login failed:', err);
      }
    }
  };

  if (user) {
    return <Navigate to={ROUTES.OVERVIEW_URL} replace />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      sx={{
        backgroundImage: {
          xs: `url(${login})`,
          md: `url(${login})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
          width: isMobile ? '340px' : '420px',
          height: 'auto',
          textAlign: 'center',
          borderRadius: 6,
          boxShadow: '0px 20px 60px rgba(0,0,0,0.6)',
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
        }}
      >
        <CardContent sx={{ py: 5, height: '100%' }}>
          <Column height="100%" justifyContent={'space-between'} spacing={3}>
            <Column>
              <FinSightIcon />
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
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
                  fontSize: '1.1rem',
                  fontWeight: 400,
                }}
              >
                {t('subtitle')}
              </Typography>
            </Column>
            <Column spacing={1}>
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
                  ux_mode={'popup'}
                  width={'200px'}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.875rem',
                }}
              >
                {t('secure_note')}
              </Typography>
            </Column>

            <LegalLinks />
          </Column>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
