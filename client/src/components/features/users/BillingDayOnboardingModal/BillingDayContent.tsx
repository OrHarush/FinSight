import { Button, Grid, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

import DayGrid from './DayGrid';

interface BillingDayContentProps {
  onNext: (billingDay: number) => void;
  isSubmitting?: boolean;
}

const QUICK_PICK_DAYS = [2, 10, 15, 20];

const BillingDayContent = ({ onNext, isSubmitting = false }: BillingDayContentProps) => {
  const { t } = useTranslation('user');
  const [selectedDay, setSelectedDay] = useState(2);
  const [showDayGrid, setShowDayGrid] = useState(false);

  const advanceStep = () => {
    onNext(selectedDay);
  };

  const revealDayGrid = () => {
    setShowDayGrid(true);
  };


  return (
    <Column spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {t('billingStep.title')}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {t('billingStep.subtitle')}
      </Typography>

      {!showDayGrid ? (
        <>
          <Grid container spacing={1} py={1}>
            {QUICK_PICK_DAYS.map(day => (
              <Grid key={day} size={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSelectedDay(day)}
                  sx={{
                    flexDirection: 'column',
                    py: 1.5,
                    height: '54px',
                    borderColor: selectedDay === day ? 'primary.main' : 'divider',
                    backgroundColor:
                      selectedDay === day
                        ? theme => alpha(theme.palette.primary.main, 0.12)
                        : 'action.hover',
                    color: selectedDay === day ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor:
                        selectedDay === day
                          ? theme => alpha(theme.palette.primary.main, 0.12)
                          : 'action.hover',
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight={700} lineHeight={1}>
                    {day}
                  </Typography>
                  <Typography variant="caption" color="inherit">
                    {t('onboardingModal.ofTheMonth')}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="text"
            onClick={revealDayGrid}
            sx={{
              color: 'text.secondary',
              textDecoration: 'underline',
              fontSize: 'body2.fontSize',
              alignSelf: 'center',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            }}
          >
            {t('onboardingModal.otherDay')}
          </Button>
        </>
      ) : (
        <DayGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={advanceStep}
        disabled={isSubmitting}
        sx={{ mt: 1 }}
      >
        {t('onboardingModal.confirm')}
      </Button>
    </Column>
  );
};

export default BillingDayContent;
