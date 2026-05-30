import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Header from '@/pages/Home/HowItWorksSection/Header';
import FixedExpensesMockup from '@/pages/Home/HowItWorksSection/mockups/FixedExpensesMockup';
import LogicalMonthMockup from '@/pages/Home/HowItWorksSection/mockups/LogicalMonthMockup';
import QuickAddMockup from '@/pages/Home/HowItWorksSection/mockups/QuickAddMockup';
import SharedWorkspaceMockup from '@/pages/Home/HowItWorksSection/mockups/SharedWorkspaceMockup';
import StepsMobile from '@/pages/Home/HowItWorksSection/StepsMobile';
import StepsPC from '@/pages/Home/HowItWorksSection/StepsPC';
import { HowItWorksStep } from '@/pages/Home/HowItWorksSection/types';

const STAGE_INTERVAL_MS = 5000;

const HowItWorksSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });
  const [activeStage, setActiveStage] = useState(0);

  const steps: HowItWorksStep[] = [
    {
      number: t('landing.how.step01.number'),
      title: t('landing.how.step01.title'),
      description: t('landing.how.step01.description'),
      mockup: <FixedExpensesMockup />,
    },
    {
      number: t('landing.how.step02.number'),
      title: t('landing.how.step02.title'),
      description: t('landing.how.step02.description'),
      mockup: <QuickAddMockup />,
    },
    {
      number: t('landing.how.step03.number'),
      title: t('landing.how.step03.title'),
      description: t('landing.how.step03.description'),
      mockup: <LogicalMonthMockup />,
    },
    {
      number: t('landing.how.step04.number'),
      title: t('landing.how.step04.title'),
      description: t('landing.how.step04.description'),
      mockup: <SharedWorkspaceMockup />,
    },
  ];

  const stageCount = steps.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveStage(s => (s + 1) % stageCount);
    }, STAGE_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [activeStage, stageCount]);

  const goToStage = (index: number) => {
    const wrapped = ((index % stageCount) + stageCount) % stageCount;
    setActiveStage(wrapped);
  };

  return (
    <Column
      component="section"
      id="how-it-works"
      ref={sectionRef}
      spacing={0}
      sx={{
        px: { xs: 2, md: 4 },
        py: { xs: 8, md: 12 },
        position: 'relative',
        scrollMarginTop: '80px',
      }}
    >
      <Header isInView={isInView} />
      <StepsPC steps={steps} isInView={isInView} />
      <StepsMobile steps={steps} activeStage={activeStage} onSelectStage={goToStage} />
    </Column>
  );
};

export default HowItWorksSection;
