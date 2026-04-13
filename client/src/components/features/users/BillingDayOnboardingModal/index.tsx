import { useAuth } from '@/providers/AuthProvider';

import BillingDayOnboardingDialog from './BillingDayOnboardingDialog';

const BillingDayOnboarding = () => {
  const { user } = useAuth();

  const hasCompletedOnboarding = !!user && user.hasCompletedOnboarding === true;

  if (!user || hasCompletedOnboarding) {
    return null;
  }

  return <BillingDayOnboardingDialog />;
};

export default BillingDayOnboarding;
