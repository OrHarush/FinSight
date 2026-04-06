import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import ProcessStep from '@/pages/Home/HowItWorksSection/ProcessStep';
import { HowItWorksStepProps } from '@/pages/Home/HowItWorksSection/types';

interface StepsMobileProps {
  steps: HowItWorksStepProps[];
  activeStage: number;
}

const StepsMobile = ({ steps, activeStage }: StepsMobileProps) => (
  <Box
    sx={{
      display: { xs: 'block', md: 'none' },
      width: '100%',
      maxWidth: 300,
      height: '140px',
      mx: 'auto',
    }}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStage}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        transition={{ duration: 0.28 }}
      >
        <ProcessStep {...steps[activeStage]} isActive={true} />
      </motion.div>
    </AnimatePresence>
  </Box>
);

export default StepsMobile;
