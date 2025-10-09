import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import notFoundIllustration from '@/assets/vault.png';
import { ROUTES } from '@/constants/Routes';
import { Home, ArrowBack } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        textAlign: 'center',
        backgroundImage: `url(${notFoundIllustration})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '600px',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', sm: '6rem' },
            fontWeight: 800,
            background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 50%, #e879f9 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.05em',
            mb: 2,
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            color: 'white',
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Vault is Empty
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: 480,
            mb: 5,
            fontSize: '1.1rem',
          }}
        >
          {
            "The page you're looking for doesn't exist or has been moved. Let's get you back to safety."
          }
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate(ROUTES.DASHBOARD_URL)}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)',
              },
            }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
