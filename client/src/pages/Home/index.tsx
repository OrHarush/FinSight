import { Box, Grid, Typography, useTheme } from '@mui/material';
import { Psychology, Shield, Visibility } from '@mui/icons-material';
import Column from '@/components/shared/layout/containers/Column';
import Principle from '@/pages/Home/Principle';
import homePage from '@/assets/homePage.jpg';
import HomePageFooter from '@/pages/Home/HomePageFooter';
import { useTranslation } from 'react-i18next';
import CtaButton from '@/pages/Home/CtaButton';

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
          <Column>
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
              {t('subtitle2')}
            </Typography>
          </Column>
        </Column>
        <CtaButton />
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
