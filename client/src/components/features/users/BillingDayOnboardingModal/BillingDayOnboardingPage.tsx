import Column from '@/components/shared/layout/containers/Column';

import OnboardingShell from './OnboardingShell';

const BillingDayOnboardingPage = () => {
  return (
    <Column
      spacing={3}
      sx={{
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        px: 3,
        py: 5,
        minHeight: '70vh',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
      }}
    >
      <OnboardingShell />
    </Column>
  );
};

export default BillingDayOnboardingPage;
