import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/constants/Routes';

interface CtaButtonProps {
  labelKey?: string;
}

const CtaButton = ({ labelKey = 'cta' }: CtaButtonProps) => {
  const { i18n, t } = useTranslation('home');
  const theme = useTheme();
  const isRtl = i18n.language === 'he';

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
          `0 0 48px ${alpha(theme.palette.primary.main, 0.65)}`,
          `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ borderRadius: 100, display: 'inline-block' }}
    >
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
          px: 6,
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 700,
          borderRadius: 100,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            transform: 'translateY(-3px)',
            boxShadow: `0 20px 56px ${alpha(theme.palette.primary.main, 0.5)}`,

            '& .MuiButton-endIcon': {
              transform: isRtl ? 'translateX(-4px)' : 'translateX(4px)',
            },
          },
        }}
      >
        {t(labelKey)}
      </Button>
    </motion.div>
  );
};

export default CtaButton;
