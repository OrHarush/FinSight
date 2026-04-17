import { alpha, Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const HOW_IT_WORKS_ANCHOR = '#how-it-works';

const SecondaryCtaButton = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <Button
      variant="text"
      size="large"
      component="a"
      href={HOW_IT_WORKS_ANCHOR}
      sx={{
        px: 3.5,
        py: 1.75,
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: 100,
        color: 'text.primary',
        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        background: 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.5),
        },
      }}
    >
      {t('landing.hero.ctaSecondary')}
    </Button>
  );
};

export default SecondaryCtaButton;
