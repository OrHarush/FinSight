import { useTranslation } from 'react-i18next';
import { alpha, Button, useTheme } from '@mui/material';
import { ROUTES } from '@/constants/Routes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CtaButton = () => {
  const { i18n, t } = useTranslation('home');
  const theme = useTheme();
  const isRtl = i18n.language === 'he';

  return (
    <Button
      variant="contained"
      size="large"
      component="a"
      href={ROUTES.LOGIN_URL}
      endIcon={
        isRtl ? (
          <ArrowBackIcon sx={{ transition: 'transform 0.3s ease' }} />
        ) : (
          <ArrowForwardIcon sx={{ transition: 'transform 0.3s ease' }} />
        )
      }
      sx={{
        mt: 2,
        px: 8,
        py: 2.5,
        fontSize: '1.2rem',
        fontWeight: 700,
        borderRadius: 100,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
        transition: 'all 0.3s ease',

        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          transform: 'translateY(-3px)',
          boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, 0.4)}`,

          '& .MuiButton-endIcon': {
            transform: isRtl ? 'translateX(-4px)' : 'translateX(4px)',
          },
        },
      }}
    >
      {t('cta')}
    </Button>
  );
};

export default CtaButton;
