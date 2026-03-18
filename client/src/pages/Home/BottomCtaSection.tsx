import { alpha, Typography, useTheme } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CtaButton from '@/pages/Home/HeroSection/HeroContent/CtaButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import GppGoodIcon from '@mui/icons-material/GppGood';

const TrustItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  const theme = useTheme();

  return (
    <Row alignItems="center" spacing={1}>
      <Row
        sx={{
          color: theme.palette.primary.main,
          filter: `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.5)})`,
          '& svg': { fontSize: 18 },
        }}
      >
        {icon}
      </Row>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {text}
      </Typography>
    </Row>
  );
};

const BottomCtaSection = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  return (
    <Column
      ref={sectionRef}
      sx={{
        px: { xs: 2, md: 8 },
        py: { xs: 10, md: 14 },
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Column spacing={5} alignItems="center" sx={{ maxWidth: 640 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Column spacing={2} alignItems="center">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '3rem' },
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
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
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Column spacing={1.5} alignItems="flex-start">
            <TrustItem icon={<DevicesIcon />} text={t('bottomCta.feature1')} />
            <TrustItem icon={<MoneyOffIcon />} text={t('bottomCta.feature2')} />
            <TrustItem icon={<GppGoodIcon />} text={t('bottomCta.feature3')} />
          </Column>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CtaButton labelKey="ctaBottom" />
        </motion.div>
      </Column>
    </Column>
  );
};

export default BottomCtaSection;
