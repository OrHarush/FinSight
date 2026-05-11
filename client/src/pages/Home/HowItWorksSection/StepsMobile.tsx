import { Box, IconButton, alpha, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import StepCard from '@/pages/Home/HowItWorksSection/StepCard';
import { HowItWorksStep } from '@/pages/Home/HowItWorksSection/types';

const SWIPE_OFFSET_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 300;

interface StepsMobileProps {
  steps: HowItWorksStep[];
  activeStage: number;
  onSelectStage: (index: number) => void;
}

const StepsMobile = ({ steps, activeStage, onSelectStage }: StepsMobileProps) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'he';
  const activeStep = steps[activeStage];
  const PrevIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipedLeft =
      info.offset.x < -SWIPE_OFFSET_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const swipedRight =
      info.offset.x > SWIPE_OFFSET_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (swipedLeft) {
      onSelectStage(activeStage + 1);
      return;
    }

    if (swipedRight) {
      onSelectStage(activeStage - 1);
    }
  };

  return (
    <Column
      spacing={2.5}
      alignItems="center"
      sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}
    >
      <Row alignItems="center" justifyContent="center" spacing={1.25}>
        <IconButton
          onClick={() => onSelectStage(activeStage - 1)}
          aria-label="Previous step"
          size="small"
          sx={{ color: 'text.secondary', p: 0.5 }}
        >
          <PrevIcon fontSize="small" />
        </IconButton>

        <Row justifyContent="center" alignItems="center" spacing={0.75}>
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

        <IconButton
          onClick={() => onSelectStage(activeStage + 1)}
          aria-label="Next step"
          size="small"
          sx={{ color: 'text.secondary', p: 0.5 }}
        >
          <NextIcon fontSize="small" />
        </IconButton>
      </Row>

      <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', touchAction: 'pan-y' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.45 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            style={{ cursor: 'grab' }}
            whileTap={{ cursor: 'grabbing' }}
          >
            <StepCard step={activeStep} align="center" />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Column>
  );
};

export default StepsMobile;
