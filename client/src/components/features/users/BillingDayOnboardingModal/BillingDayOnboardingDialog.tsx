import { Dialog, DialogContent } from '@mui/material';
import { useState } from 'react';

import OnboardingShell from './OnboardingShell';

const BillingDayOnboardingDialog = () => {
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
      <DialogContent sx={{ p: 1 }}>
        <OnboardingShell onDone={() => setDismissed(true)} />
      </DialogContent>
    </Dialog>
  );
};

export default BillingDayOnboardingDialog;
