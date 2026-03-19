import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTranslation } from 'react-i18next';
import { alpha, Box, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import TuneIcon from '@mui/icons-material/Tune';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Column from '@/components/shared/layout/containers/Column';
import Typography from '@mui/material/Typography';
import ProcessAnimation from '@/pages/Home/HowItWorksSection/ProcessAnimation';
import Row from '@/components/shared/layout/containers/Row';
import ProcessStep from '@/pages/Home/HowItWorksSection/ProcessStep';

const HowItWorksSection = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage(s => (s + 1) % 3);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      icon: <TuneIcon />,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      accentColor: theme.palette.primary.main,
    },
    {
      icon: <AddCircleOutlineIcon />,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      accentColor: theme.palette.success.main,
    },
    {
      icon: <DashboardIcon />,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      accentColor: theme.palette.warning.main,
    },
  ];

  return (
    <Column
      ref={sectionRef}
      spacing={0}
      sx={{ px: { xs: 2, md: 8 }, py: { xs: 8, md: 12 }, position: 'relative' }}
    >
      <Column spacing={1.5} alignItems="center" sx={{ mb: { xs: 5, md: 6 }, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.8rem' },
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {t('howItWorks.sectionTitle')}
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 560,
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {t('howItWorks.sectionSubtitle')}
          </Typography>
        </motion.div>
      </Column>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProcessAnimation activeStage={activeStage} />
      </motion.div>
      <Row
        spacing={{ xs: 0, md: 3 }}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          rowGap: { xs: 4 },
          alignItems: { xs: 'flex-start', md: 'flex-start' },
          maxWidth: 960,
          mx: 'auto',
        }}
      >
        {steps.map((step, index) => (
          <Row
            key={step.title}
            sx={{ flex: 1, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 + index * 0.18 }}
              style={{ flex: 1, minWidth: 0 }}
            >
              <ProcessStep {...step} isActive={activeStage === index} />
            </motion.div>
            {index < steps.length - 1 && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  width: 32,
                  height: 2,
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                  mt: 10,
                  mx: 1,
                  background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.4)}, ${alpha(theme.palette.secondary.main, 0.4)})`,
                  borderRadius: 1,
                }}
              />
            )}
          </Row>
        ))}
      </Row>
    </Column>
  );
};

export default HowItWorksSection;
