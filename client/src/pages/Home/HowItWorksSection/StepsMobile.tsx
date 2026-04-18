import { Box, alpha, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import StepCard from '@/pages/Home/HowItWorksSection/StepCard';
import { HowItWorksStep } from '@/pages/Home/HowItWorksSection/types';

interface StepsMobileProps {
  steps: HowItWorksStep[];
  activeStage: number;
}

const StepsMobile = ({ steps, activeStage }: StepsMobileProps) => {
  const theme = useTheme();
  const activeStep = steps[activeStage];

  return (
    <Column
      spacing={2.5}
      alignItems="center"
      sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}
    >
      <Row justifyContent="center" spacing={0.75}>
        {steps.map((step, i) => (
          <Box
            key={step.number}
            sx={{
              width: activeStage === i ? 22 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                activeStage === i
                  ? theme.palette.primary.main
                  : alpha(theme.palette.text.secondary, 0.2),
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </Row>

      <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.28 }}
          >
            <StepCard step={activeStep} align="center" />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Column>
  );
};

export default StepsMobile;
