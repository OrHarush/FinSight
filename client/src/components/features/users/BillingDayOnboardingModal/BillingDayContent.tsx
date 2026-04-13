import { Button, Grid, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { UserDto } from '@/types/User';

import DayGrid from './DayGrid';

interface CompleteOnboardingPayload {
  hasCompletedOnboarding: true;
  billingDay?: number;
}

interface BillingDayContentProps {
  onConfirm?: () => void;
}

const QUICK_PICK_DAYS = [2, 10, 15, 20];

const BillingDayContent = ({ onConfirm = () => {} }: BillingDayContentProps) => {
  const { t } = useTranslation('user');
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState(2);
  const [showDayGrid, setShowDayGrid] = useState(false);

  const mutation = useApiMutation<UserDto, CompleteOnboardingPayload>({
    method: 'patch',
    url: API_ROUTES.USERS_ME,
  });

  const confirmOnboarding = () => {
    const payload: CompleteOnboardingPayload = { hasCompletedOnboarding: true };

    if (selectedDay !== 1) {
      payload.billingDay = selectedDay;
    }

    updateUser({ ...user!, hasCompletedOnboarding: true });
    onConfirm();

    mutation.mutate(payload, {
      onSuccess: updatedUser => {
        updateUser(updatedUser ?? { ...user!, hasCompletedOnboarding: true });
        queryClient.invalidateQueries({ queryKey: queryKeys.user() });
        queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods() });
      },
      onError: () => {
        updateUser({ ...user!, hasCompletedOnboarding: true });
      },
    });
  };

  const revealDayGrid = () => {
    setShowDayGrid(true);
  };

  const isQuickPickSelected = QUICK_PICK_DAYS.includes(selectedDay);
  const dayGridValue = isQuickPickSelected ? 0 : selectedDay;

  return (
    <Column spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {t('onboardingModal.subtitle')}
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
        <DayGrid selectedDay={dayGridValue} onSelectDay={setSelectedDay} />
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={confirmOnboarding}
        disabled={mutation.isPending}
        sx={{ mt: 1 }}
      >
        {t('onboardingModal.confirm')}
      </Button>
    </Column>
  );
};

export default BillingDayContent;
