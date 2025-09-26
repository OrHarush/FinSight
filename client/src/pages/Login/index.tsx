import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';
import vault2Image from '../../../assets/vault2.png';
import { ROUTES } from '@/constants/Routes';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD_URL} replace />;
  }
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        console.log('here success google token = ' + credentialResponse.credential);
        await loginWithGoogle(credentialResponse.credential);
        navigate(ROUTES.DASHBOARD_URL);
      } catch (err) {
        console.error('Google login failed:', err);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: `url(${vault2Image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      }}
    >
      <Card
        sx={{
          width: 500,
          borderRadius: 4,
          boxShadow: '0px 8px 20px rgba(0,0,0,0.5)',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent>
          <img src="../../../assets/finsightIcon.png" alt="App Logo" width={100} height={100} />
          <Typography variant="h4" fontWeight={700} mb={2} color="white">
            Welcome to FinSight
          </Typography>
          <Typography variant="body1" mb={4} color="gray.300">
            Your personal finance dashboard
          </Typography>

          {user ? (
            <></>
          ) : (
            <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
