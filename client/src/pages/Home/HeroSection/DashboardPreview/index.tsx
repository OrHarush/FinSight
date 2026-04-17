import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { alpha, Box, IconButton, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import BillingCycleFrame from '@/pages/Home/HeroSection/DashboardPreview/BillingCycleFrame';
import CsvImportFrame from '@/pages/Home/HeroSection/DashboardPreview/CsvImportFrame';
import PrivacyFrame from '@/pages/Home/HeroSection/DashboardPreview/PrivacyFrame';

const FRAME_COMPONENTS = [BillingCycleFrame, CsvImportFrame, PrivacyFrame];
const AUTO_ADVANCE_MS = 4500;

const DashboardPreview = () => {
  const theme = useTheme();
  const { i18n } = useTranslation('home');
  const isRtl = i18n.language === 'he';
  const isSmallScreen = useIsSmallScreen();
  const [activeFrame, setActiveFrame] = useState(0);
  const [manualNavCount, setManualNavCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActiveFrame(current => (current + 1) % FRAME_COMPONENTS.length);
  }, []);

  const goToFrame = useCallback((index: number) => {
    setManualNavCount(count => count + 1);
    setActiveFrame(index);
  }, []);

  const goToPrev = useCallback(() => {
    setManualNavCount(count => count + 1);
    setActiveFrame(current =>
      current === 0 ? FRAME_COMPONENTS.length - 1 : current - 1,
    );
  }, []);

  const goToNext = useCallback(() => {
    setManualNavCount(count => count + 1);
    advance();
  }, [advance]);

  useEffect(() => {
    if (isPaused || isSmallScreen) {
      return;
    }

    timerRef.current = setInterval(advance, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [advance, isPaused, isSmallScreen, activeFrame]);

  if (isSmallScreen) {
    return null;
  }

  const ActiveFrame = FRAME_COMPONENTS[activeFrame];
  const PrevIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Box
      sx={{
        flex: '0 0 auto',
        width: { xs: '100%', sm: 420, md: 440 },
        maxWidth: 460,
        mx: 'auto',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.4 }}
      >
        <Column
          sx={{
            position: 'relative',
            borderRadius: 4,
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2.5, sm: 3 },
            backgroundColor: alpha(theme.palette.background.paper, 0.55),
            backdropFilter: 'blur(32px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            boxShadow: `0 24px 64px ${alpha('#000', 0.22)}`,
            minHeight: 360,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', minHeight: 300 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFrame}-${manualNavCount}`}
                initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ width: '100%' }}
              >
                <ActiveFrame isPaused={isPaused} />
              </motion.div>
            </AnimatePresence>
          </Box>

          <Row
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
          >
            <IconButton
              size="small"
              onClick={goToPrev}
              aria-label="Previous frame"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <PrevIcon fontSize="small" />
            </IconButton>

            <Row spacing={0.75} alignItems="center">
              {FRAME_COMPONENTS.map((_, index) => {
                const isActive = index === activeFrame;

                return (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => goToFrame(index)}
                    aria-label={`Go to frame ${index + 1}`}
                    sx={{
                      width: isActive ? 22 : 8,
                      height: 8,
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      borderRadius: '999px',
                      background: isActive
                        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        : alpha(theme.palette.text.primary, 0.2),
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </Row>

            <IconButton
              size="small"
              onClick={goToNext}
              aria-label="Next frame"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <NextIcon fontSize="small" />
            </IconButton>
          </Row>
        </Column>
      </motion.div>
    </Box>
  );
};

export default DashboardPreview;
