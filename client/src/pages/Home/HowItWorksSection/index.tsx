import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TuneIcon from '@mui/icons-material/Tune';
import { useTheme } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Header from '@/pages/Home/HowItWorksSection/Header';
import ProcessAnimation from '@/pages/Home/HowItWorksSection/ProcessAnimation';
import StepsMobile from '@/pages/Home/HowItWorksSection/StepsMobile';
import StepsPC from '@/pages/Home/HowItWorksSection/StepsPC';
import { HowItWorksStepProps } from '@/pages/Home/HowItWorksSection/types';

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

  const steps: HowItWorksStepProps[] = [
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
      component={'section'}
      id="how-it-works"
      ref={sectionRef}
      spacing={0}
      sx={{ px: { xs: 2, md: 8 }, py: { xs: 8, md: 12 }, position: 'relative', scrollMarginTop: '80px' }}
    >
      <Header isInView={isInView} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProcessAnimation activeStage={activeStage} />
      </motion.div>
      <StepsMobile steps={steps} activeStage={activeStage} />
      <StepsPC steps={steps} activeStage={activeStage} isInView={isInView} />
    </Column>
  );
};

export default HowItWorksSection;
