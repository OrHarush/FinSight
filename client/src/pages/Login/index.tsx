import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';
import vaultImage from '@/assets/vault2.png';
import loginMobileImage from '@/assets/mobileLogin.png';
import { ROUTES } from '@/constants/Routes';
import { Navigate, useNavigate } from 'react-router-dom';
import FinSightIcon from '@/pages/Login/FinSightIcon';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import LegalLinks from '@/pages/Login/LegalLinks';

const LoginPage = () => {
  const { t } = useTranslation('login');
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { alertError } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          xs: `url(${loginMobileImage})`,
          md: `url(${vaultImage})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Card
        sx={{
          width: isMobile ? '340px' : '420px',
          height: isMobile ? '400px' : '440px',
          textAlign: 'center',
          borderRadius: 6,
          boxShadow: '0px 20px 60px rgba(0,0,0,0.6)',
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
        }}
      >
        <CardContent sx={{ py: 5, px: 2 }}>
          <FinSightIcon />
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight={700}
            mb={1.5}
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
            mb={4}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.1rem',
              fontWeight: 400,
            }}
          >
            {t('subtitle')}
          </Typography>
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
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 3,
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.875rem',
            }}
          >
            {t('secure_note')}
          </Typography>
          <LegalLinks />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
