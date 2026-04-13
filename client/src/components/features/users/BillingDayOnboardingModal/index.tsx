import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { UserDto } from '@/types/User';

import DayGrid from './DayGrid';

interface CompleteOnboardingPayload {
  hasCompletedOnboarding: true;
  billingDay?: number;
}

const BillingDayOnboardingModal = () => {
  const { t } = useTranslation('user');
  const { user, updateUser } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [dismissed, setDismissed] = useState(false);

  const mutation = useApiMutation<UserDto, CompleteOnboardingPayload>({
    method: 'patch',
    url: API_ROUTES.USERS_ME,
  });

  const hasCompletedOnBoarding = !!user && user.hasCompletedOnboarding === true;

  const showModal = !dismissed && !hasCompletedOnBoarding;

  const confirmOnboarding = () => {
    const payload: CompleteOnboardingPayload = { hasCompletedOnboarding: true };

    if (selectedDay !== 1) {
      payload.billingDay = selectedDay;
    }

    setDismissed(true);

    mutation.mutate(payload, {
      onSuccess: updatedUser => {
        updateUser(updatedUser ?? { ...user!, hasCompletedOnboarding: true });
      },
      onError: () => {
        updateUser({ ...user!, hasCompletedOnboarding: true });
      },
    });
  };

  const confirmLabel =
    selectedDay === 1 || !showPicker
      ? t('onboardingModal.confirmDefault')
      : t('onboardingModal.confirmWithDay', { day: selectedDay });

  if (!showModal) {
    return null;
  }

  return (
    showModal && (
      <Dialog
        open={showModal}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
        onClose={() => {}}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              paddingY: 1,
              paddingX: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ p: 1 }}>
          <Row spacing={1} alignItems="center">
            {showPicker && (
              <IconButton size="small" onClick={() => setShowPicker(false)}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
              {t('onboardingModal.title')}
            </Typography>
          </Row>
        </DialogTitle>

        <DialogContent>
          <Column spacing={2} pt={1}>
            <Typography variant="body2" color="text.secondary">
              {t('onboardingModal.description')}
            </Typography>

            {showPicker && (
              <Column spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  {t('onboardingModal.pickDayTitle')}
                </Typography>
                <DayGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} />
              </Column>
            )}
          </Column>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'row', gap: 1, px: 2, pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={confirmOnboarding}
            disabled={mutation.isPending}
          >
            {confirmLabel}
          </Button>

          {!showPicker && (
            <Button variant="outlined" fullWidth onClick={() => setShowPicker(true)}>
              {t('onboardingModal.changeButton')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    )
  );
};

export default BillingDayOnboardingModal;
