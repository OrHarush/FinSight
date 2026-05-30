import { Button, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import LyraLogo from '@/components/shared/layout/LyraLogo';
import AppearanceSettings from '@/components/shared/layout/NavBar/AppearanceSettings';
import NavBarContainer from '@/components/shared/layout/NavBar/NavBarContainer';
import { ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const LandingNavbar = () => {
  const { t } = useTranslation('home');
  const isMobile = useIsMobile();

  return (
    <NavBarContainer sx={{ justifyContent: 'space-between' }}>
      <Link
        href={ROUTES.HOME_URL}
        aria-label={t('landing.a11y.logoAlt')}
        sx={{
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
          '&:hover': { opacity: 0.8 },
        }}
      >
        <LyraLogo iconSize={32} showWordmark={!isMobile} alt={t('landing.a11y.logoAlt')} />
      </Link>
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
