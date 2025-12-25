import { alpha, Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { Psychology, Shield, Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Column from '@/components/layout/Containers/Column';
import Principle from '@/pages/Home/Principle';
import homePage from '@/assets/homePage.jpg';
import { ROUTES } from '@/constants/Routes';
import HomePageFooter from '@/pages/Home/HomePageFooter';

const HomePage = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  const principles = [
    { icon: <Visibility />, label: t('principles.clearInsights') },
    { icon: <Psychology />, label: t('principles.smartDecisions') },
    { icon: <Shield />, label: t('principles.peaceOfMind') },
  ];

  return (
    <Column
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage: `url(${homePage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <Typography component="p" sx={{ display: 'none' }}>
        FinSight personal finance dashboard showing income, expenses, categories and balances
      </Typography>
      <Column
        spacing={6}
        alignItems="center"
        sx={{
          flex: 1,
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <Column spacing={3} alignItems="center" sx={{ maxWidth: 800 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.1,
              color: 'text.primary',
            }}
          >
            {t('headline.line1')}
            <br />
            {t('headline.line2')}{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('headline.highlight')}
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
            {t('subtitle')}
          </Typography>
        </Column>
        <Button
          variant="contained"
          size="large"
          component="a"
          href={ROUTES.LOGIN_URL}
          sx={{
            mt: 2,
            px: 8,
            py: 2.5,
            fontSize: '1.2rem',
            fontWeight: 700,
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
          {t('cta')}
        </Button>
        <Grid container spacing={1}>
          {principles.map(p => (
            <Grid key={p.label} size={{ xs: 12, sm: 4 }} justifyItems={'center'}>
              <Principle label={p.label} icon={p.icon} />
            </Grid>
          ))}
        </Grid>
      </Column>
      <HomePageFooter />
    </Column>
  );
};

export default HomePage;
