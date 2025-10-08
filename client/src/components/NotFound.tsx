import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import notFoundIllustration from '@/assets/empty_vault.png';
import { ROUTES } from '@/constants/Routes';

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
        background: theme => theme.palette.background.default,
        px: 2,
      }}
    >
      {/*<img*/}
      {/*  src={notFoundIllustration}*/}
      {/*  alt="Page not found"*/}
      {/*  style={{*/}
      {/*    width: '240px',*/}
      {/*    opacity: 0.85,*/}
      {/*    marginBottom: 24,*/}
      {/*  }}*/}
      {/*/>*/}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Oops! Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 4 }}>
        It looks like you’ve reached a dead end. The page you’re looking for doesn’t exist or has
        been moved.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(ROUTES.DASHBOARD_URL)}
        sx={{
          borderRadius: 3,
          textTransform: 'none',
          px: 4,
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
