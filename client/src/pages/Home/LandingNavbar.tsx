import { Button, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import lyraIcon from '@/assets/lyraIcon.webp';
import Row from '@/components/shared/layout/containers/Row';
import AppearanceSettings from '@/components/shared/layout/NavBar/AppearanceSettings';
import NavBarContainer from '@/components/shared/layout/NavBar/NavBarContainer';
import { ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const LandingNavbar = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <NavBarContainer sx={{ justifyContent: 'space-between' }}>
      <Row alignItems="center" spacing={1}>
        <img
          src={lyraIcon}
          alt={t('landing.a11y.logoAlt')}
          style={{ width: 32, height: 32, objectFit: 'contain' }}
        />
        {!isMobile && (
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Lyra
          </Typography>
        )}
      </Row>
      <Row
        alignItems="center"
        spacing={{ xs: 1, sm: 4 }}
        component="nav"
        aria-label="Main navigation"
      >
        <AppearanceSettings />
        {!isMobile && (
          <Row spacing={1}>
            <Button
              variant="outlined"
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
        )}
      </Row>
    </NavBarContainer>
  );
};

export default LandingNavbar;
