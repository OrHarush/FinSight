import BillingDayOnboardingDialog from '@/components/features/users/BillingDayOnboardingModal';
import BillingDayOnboardingPage from '@/components/features/users/BillingDayOnboardingModal/BillingDayOnboardingPage';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useAuth } from '@/providers/AuthProvider';

import QuickAddPage from './QuickAddPage';

const OnBoardingPage = () => {
  const { user } = useAuth();
  const isSmallScreen = useIsSmallScreen();

  const hasCompletedOnboarding = !!user && user.hasCompletedOnboarding === true;

  if (isSmallScreen && user && !hasCompletedOnboarding) {
    return <BillingDayOnboardingPage />;
  }

  return (
    <>
      <QuickAddPage />
      <BillingDayOnboardingDialog />
    </>
  );
};

export default OnBoardingPage;
