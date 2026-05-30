import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import InvitationLandingShell from '@/pages/Invitation/InvitationLandingShell';

interface InvitationLoadErrorProps {
  onRetry: () => void;
}

const InvitationLoadError = ({ onRetry }: InvitationLoadErrorProps) => {
  const { t } = useTranslation('user');

  return (
    <InvitationLandingShell>
      <Column spacing={2} alignItems="center" sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          {t('sharedHousehold.landing.loadError')}
        </Typography>
        <Button
          onClick={onRetry}
          variant="outlined"
          startIcon={<ReplayRoundedIcon />}
        >
          {t('sharedHousehold.landing.retry')}
        </Button>
      </Column>
    </InvitationLandingShell>
  );
};

export default InvitationLoadError;
