import { Box, Link, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import CtaButton from '@/pages/Home/HeroSection/HeroContent/CtaButton';
import SecondaryCtaButton from '@/pages/Home/HeroSection/HeroContent/SecondaryCtaButton';
import TrustBadges from '@/pages/Home/HeroSection/HeroContent/TrustBadges';

const HIGHLIGHT_COLOR = '#a78bfa';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: 'easeOut' as const, delay },
});

const renderHeadlineWithHighlight = (headline: string, word: string) => {
  const pattern = new RegExp(`(${word})`, 'i');
  const parts = headline.split(pattern);

  return parts.map((part, index) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <Box key={index} component="span" sx={{ color: HIGHLIGHT_COLOR }}>
        {part}
      </Box>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
};

const HeroContent = () => {
  const { t, i18n } = useTranslation('home');
  const isRtl = i18n.language === 'he';
  const highlightWord = isRtl ? 'משקרת' : 'whole story';

  return (
    <Column
      spacing={4}
      alignItems={{ xs: 'center', md: 'flex-start' }}
      sx={{
        flex: '0 0 auto',
        maxWidth: { xs: 520, md: 640 },
        textAlign: { xs: 'center', md: 'start' },
      }}
    >
      <motion.div {...fadeUp(0.05)}>
        <Column spacing={2.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '3rem', md: '3.6rem' },
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'text.primary',
              whiteSpace: 'pre-line',
            }}
          >
            {renderHeadlineWithHighlight(t('landing.hero.headline'), highlightWord)}
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'text.secondary',
              maxWidth: 560,
              lineHeight: 1.7,
              fontWeight: 400,
              whiteSpace: { xs: 'pre-line', md: 'normal' },
            }}
          >
            {t('landing.hero.subheadline')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.8rem', md: '0.85rem' },
              color: 'text.disabled',
              lineHeight: 1.6,
            }}
          >
            {t('landing.hero.trustLine')}
          </Typography>
        </Column>
      </motion.div>

      <motion.div {...fadeUp(0.2)}>
        <Row
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems="center"
          flexWrap="wrap"
          justifyContent={{ xs: 'center', md: 'flex-start' }}
          sx={{ rowGap: 1.5 }}
        >
          <CtaButton />
          <SecondaryCtaButton />
        </Row>
      </motion.div>

      <motion.div {...fadeUp(0.35)}>
        <TrustBadges />
      </motion.div>

      <motion.div {...fadeUp(0.45)}>
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            gap: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('alreadyHaveAccount')}
          </Typography>
          <Link
            component="a"
            href={ROUTES.LOGIN_URL}
            variant="body2"
            underline="hover"
            sx={{ color: 'primary.main', fontWeight: 500 }}
          >
            {t('signIn')}
          </Link>
        </Box>
      </motion.div>
    </Column>
  );
};

export default HeroContent;
