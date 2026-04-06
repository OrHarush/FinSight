import { alpha, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

import Row from '@/components/shared/layout/containers/Row';
import ProcessStep from '@/pages/Home/HowItWorksSection/ProcessStep';
import { HowItWorksStepProps } from '@/pages/Home/HowItWorksSection/types';

interface StepsPCProps {
  steps: HowItWorksStepProps[];
  activeStage: number;
  isInView: boolean;
}

const StepsPC = ({ steps, activeStage, isInView }: StepsPCProps) => {
  const theme = useTheme();

  return (
    <Row
      spacing={{ xs: 0, md: 3 }}
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'row',
        alignItems: 'flex-start',
        maxWidth: 960,
        mx: 'auto',
        mt: { md: 4 },
      }}
    >
      {steps.map((step, index) => (
        <Row
          key={step.title}
          sx={{
            flex: 1,
            alignItems: 'flex-start',
          }}
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
                display: 'block',
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
  );
};

export default StepsPC;
