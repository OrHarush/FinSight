import { alpha, Box, Button, Chip, Grid, Typography, useTheme } from '@mui/material';
import { Psychology, Shield, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Column from '@/components/layout/Containers/Column';
import homePage from '@/assets/homePage.jpg';
import Principle from '@/pages/Home/Principle';
import { ROUTES } from '@/constants/Routes';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const principles = [
    {
      icon: <Visibility />,
      label: 'Clear Insights',
    },
    {
      icon: <Psychology />,
      label: 'Smart Decisions',
    },
    {
      icon: <Shield />,
      label: 'Peace of Mind',
    },
  ];

  return (
    <Column
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/path/to/your/background-image.png)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2,
          backgroundImage: `url(${homePage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Column
        spacing={6}
        alignItems="center"
        sx={{
          flex: 1,
          justifyContent: 'center',
          px: 3,
          py: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Chip
          label="Personal Finance, Simplified"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 600,
            px: 2,
            py: 0.5,
            fontSize: '0.9rem',
          }}
        />
        <Column spacing={3} alignItems="center" sx={{ maxWidth: 800 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.1,
              color: 'text.primary',
            }}
          >
            Stop tracking.
            <br />
            Start{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              understanding
            </span>
            .
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.3rem' },
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: 650,
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            FinSight gives you an honest picture of your finances. See where your money goes, how
            today affects tomorrow, and whether youre really on track—without the stress.
          </Typography>
        </Column>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(ROUTES.LOGIN_URL)}
          sx={{
            mt: 2,
            px: 8,
            py: 2.5,
            fontSize: '1.2rem',
            fontWeight: 900,
            borderRadius: 100,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              transform: 'translateY(-3px)',
              boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            transition: 'all 0.3s ease',
          }}
        >
          Start Now — Its Free
        </Button>
        <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
          {principles.map(principle => (
            <Principle key={principle.label} label={principle.label} icon={principle.icon} />
          ))}
        </Grid>
      </Column>
      <Column
        alignItems="center"
        sx={{
          pb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          No credit card required • Takes less than 2 minutes
        </Typography>
      </Column>
    </Column>
  );
};

export default HomePage;
