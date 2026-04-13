import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import BillingDayContent from './BillingDayContent';

const BillingDayOnboardingDialog = () => {
  const { t } = useTranslation('user');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <Dialog
      open
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
      <DialogTitle sx={{ p: 1, fontWeight: 700 }}>
        {t('onboardingModal.beforeWeStart')}
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <BillingDayContent onConfirm={() => setDismissed(true)} />
      </DialogContent>
    </Dialog>
  );
};

export default BillingDayOnboardingDialog;
