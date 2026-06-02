import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Box, CircularProgress, DialogContent, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

import { getPhaseIconStyle, getPhaseRowStyle } from './styles';

const PHASES = ['transactions', 'accounts', 'categories', 'goals', 'finalizing'] as const;
const PHASE_DURATION_MS = 480;
const FINALIZE_INDEX = PHASES.length - 1;
const DONE_HOLD_MS = 500;

type PhaseState = 'pending' | 'active' | 'done';

interface DeletingStepProps {
  onReachFinalize: () => void;
  isComplete: boolean;
  onAnimationDone: () => void;
}

const DeletingStep = ({ onReachFinalize, isComplete, onAnimationDone }: DeletingStepProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onReachFinalizeRef = useRef(onReachFinalize);
  onReachFinalizeRef.current = onReachFinalize;
  const onAnimationDoneRef = useRef(onAnimationDone);
  onAnimationDoneRef.current = onAnimationDone;
  const hasFiredRef = useRef(false);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    if (currentIndex >= FINALIZE_INDEX) {
      return;
    }

    const timer = setTimeout(() => setCurrentIndex(prev => prev + 1), PHASE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex >= FINALIZE_INDEX && !hasFiredRef.current) {
      hasFiredRef.current = true;
      onReachFinalizeRef.current();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isComplete && currentIndex >= FINALIZE_INDEX && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      const timer = setTimeout(() => onAnimationDoneRef.current(), DONE_HOLD_MS);

      return () => clearTimeout(timer);
    }
  }, [isComplete, currentIndex]);

  const phaseStateAt = (index: number): PhaseState => {
    if (index < currentIndex) {
      return 'done';
    }

    if (index === currentIndex) {
      if (index === FINALIZE_INDEX) {
        return isComplete ? 'done' : 'active';
      }

      return 'active';
    }

    return 'pending';
  };

  return (
    <DialogContent sx={{ py: 3 }}>
      <Column spacing={1.5} sx={{ pt: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t('deleteDialog.deleting.title')}
        </Typography>
        <Column spacing={0.25}>
          {PHASES.map((phase, index) => {
            const state = phaseStateAt(index);

            return (
              <Box key={phase} sx={getPhaseRowStyle(theme, state)}>
                <Box sx={getPhaseIconStyle(theme, state)}>
                  {state === 'active' && <CircularProgress size={16} thickness={5} />}
                  {state === 'done' && <CheckRoundedIcon fontSize="small" />}
                </Box>
                <Typography component="span" sx={{ fontSize: 'inherit', color: 'inherit' }}>
                  {t(`deleteDialog.deleting.phases.${phase}`)}
                </Typography>
              </Box>
            );
          })}
        </Column>
      </Column>
    </DialogContent>
  );
};

export default DeletingStep;
