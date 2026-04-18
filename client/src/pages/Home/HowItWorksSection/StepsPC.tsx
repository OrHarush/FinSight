import { Box } from '@mui/material';
import { motion } from 'framer-motion';

import StepCard from '@/pages/Home/HowItWorksSection/StepCard';
import { HowItWorksStep } from '@/pages/Home/HowItWorksSection/types';

interface StepsPCProps {
  steps: HowItWorksStep[];
  isInView: boolean;
}

const StepsPC = ({ steps, isInView }: StepsPCProps) => (
  <Box
    sx={{
      display: { xs: 'none', md: 'grid' },
      gridTemplateColumns: 'repeat(3, 1fr)',
      alignItems: 'stretch',
      columnGap: '22px',
      width: '100%',
      maxWidth: 1100,
      mx: 'auto',
    }}
  >
    {steps.map((step, index) => (
      <motion.div
        key={step.number}
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 + index * 0.12 }}
        style={{ display: 'flex' }}
      >
        <StepCard step={step} />
      </motion.div>
    ))}
  </Box>
);

export default StepsPC;
