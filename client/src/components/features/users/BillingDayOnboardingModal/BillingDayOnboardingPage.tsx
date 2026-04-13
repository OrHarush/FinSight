import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

import BillingDayContent from './BillingDayContent';

const BillingDayOnboardingPage = () => {
  const { t } = useTranslation('user');

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
      <Typography variant="h5" fontWeight={700}>
        {t('onboardingModal.beforeWeStart')}
      </Typography>
      <BillingDayContent />
    </Column>
  );
};

export default BillingDayOnboardingPage;
