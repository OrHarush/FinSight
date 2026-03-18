import { Box, useTheme } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import CtaButton from '@/pages/Home/HeroSection/HeroContent/CtaButton';
import { useTranslation } from 'react-i18next';
import TrustBadges from '@/pages/Home/HeroSection/HeroContent/TrustBadges';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: 'easeOut', delay },
});

const HeroContent = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <Column
      spacing={4}
      alignItems={{ xs: 'center', md: 'flex-start' }}
      sx={{
        flex: '0 0 auto',
        maxWidth: { xs: 520, md: 630 },
        textAlign: { xs: 'center', md: 'start' },
      }}
    >
      <motion.div {...fadeUp(0.05)}>
        <Column spacing={2.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4rem' },
              fontWeight: 700,
              lineHeight: 1.05,
              color: 'text.primary',
            }}
          >
            {t('headline.line1')}
            <br />
            {t('headline.line2')}{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('headline.highlight')}
            </Box>
            .
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'text.secondary',
              maxWidth: 460,
              lineHeight: 1.75,
              fontWeight: 400,
            }}
          >
            {t('subtitle')}
          </Typography>
        </Column>
      </motion.div>
      <motion.div {...fadeUp(0.2)}>
        <CtaButton />
      </motion.div>
      <motion.div {...fadeUp(0.35)}>
        <TrustBadges />
      </motion.div>
    </Column>
  );
};

export default HeroContent;
