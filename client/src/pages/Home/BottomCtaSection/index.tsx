import { Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import FeatureCards from '@/pages/Home/BottomCtaSection/FeatureCards';
import CtaButton from '@/pages/Home/HeroSection/HeroContent/CtaButton';

const BottomCtaSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  return (
    <Column
      component="section"
      ref={sectionRef}
      alignItems="center"
      spacing={{ xs: 4, md: 5 }}
      sx={{
        px: { xs: 2, md: 8 },
        py: { xs: 10, md: 14 },
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <Column spacing={2} alignItems="center" sx={{ maxWidth: 720 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}
          >
            {t('bottomCta.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('bottomCta.subtitle')}
          </Typography>
        </Column>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{ width: '100%' }}
      >
        <FeatureCards />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Column spacing={1.5} alignItems="center">
          <CtaButton labelKey="ctaBottom" />
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.8rem', md: '0.85rem' },
              lineHeight: 1.7,
              maxWidth: 520,
            }}
          >
            {t('bottomCta.helper')}
          </Typography>
        </Column>
      </motion.div>
    </Column>
  );
};

export default BottomCtaSection;
