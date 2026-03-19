import { alpha, Button, IconButton, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import finSightIcon from '@/assets/finSightIconNoText.webp';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';
import { useAppTheme } from '@/providers/AppThemeProvider';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const LandingNavbar = () => {
  const theme = useTheme();
  const { t } = useTranslation('home');
  const { toggleColorMode } = useAppTheme();

  return (
    <Row
      justifyContent="space-between"
      alignItems="center"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        px: { xs: 2, md: 6 },
        py: 1.5,
        backdropFilter: 'blur(20px)',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Row alignItems="center" spacing={1}>
        <img
          src={finSightIcon}
          alt="FinSight"
          style={{ width: 32, height: 32, objectFit: 'contain' }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          FinSight
        </Typography>
      </Row>
      <Row alignItems="center" spacing={2}>
        <Row spacing={1}>
          <LanguageSelect />
          <IconButton
            onClick={toggleColorMode}
            size="small"
            sx={{
              borderRadius: '8px',
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {theme.palette.mode === 'dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
        </Row>

        <Button
          variant="outlined"
          component="a"
          href={ROUTES.LOGIN_URL}
          sx={{
            borderRadius: '100px',
            px: 3,
            ml: 1.5,
          }}
        >
          {t('navSignUp')}
        </Button>
        <Button
          variant="contained"
          component="a"
          href={ROUTES.LOGIN_URL}
          sx={{
            borderRadius: '100px',
            px: 3,
          }}
        >
          {t('navLogin')}
        </Button>
      </Row>
    </Row>
  );
};

export default LandingNavbar;
