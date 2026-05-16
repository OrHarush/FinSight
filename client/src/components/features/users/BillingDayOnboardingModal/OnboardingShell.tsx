import { Step, StepLabel, Stepper } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useAuth } from '@/providers/AuthProvider';
import { UserDto } from '@/types/User';

import BalanceStepContent from './BalanceStepContent';
import BillingDayContent from './BillingDayContent';

interface CompleteOnboardingPayload {
  hasCompletedOnboarding: true;
  billingDay?: number;
}

interface OnboardingShellProps {
  onDone?: () => void;
}

type Step = 'balance' | 'billingDay';

const OnboardingShell = ({ onDone }: OnboardingShellProps) => {
  const { t } = useTranslation('user');
  const { user, updateUser } = useAuth();
  const { primaryAccount } = useAccounts();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>('balance');

  const completeOnboarding = useApiMutation<UserDto, CompleteOnboardingPayload>({
    method: 'patch',
    url: API_ROUTES.USERS_ME,
  });

  const finishOnboarding = (selectedDay: number) => {
    const payload: CompleteOnboardingPayload = { hasCompletedOnboarding: true };

    if (selectedDay !== 1) {
      payload.billingDay = selectedDay;
    }

    updateUser({ ...user!, hasCompletedOnboarding: true });
    onDone?.();

    completeOnboarding.mutate(payload, {
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

  const advanceFromBalance = () => {
    setStep('billingDay');
  };

  const activeStep = step === 'balance' ? 0 : 1;

  return (
    <Column spacing={2}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
        <Step>
          <StepLabel>{t('onboarding.steps.balance')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('onboarding.steps.billingDay')}</StepLabel>
        </Step>
      </Stepper>

      {step === 'balance' ? (
        primaryAccount ? (
          <BalanceStepContent
            accountId={primaryAccount._id}
            onComplete={advanceFromBalance}
          />
        ) : null
      ) : (
        <BillingDayContent
          onNext={finishOnboarding}
          isSubmitting={completeOnboarding.isPending}
        />
      )}
    </Column>
  );
};

export default OnboardingShell;
