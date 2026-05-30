import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

interface SharedHouseholdLoadErrorProps {
  onRetry: () => void;
}

const SharedHouseholdLoadError = ({ onRetry }: SharedHouseholdLoadErrorProps) => {
  const { t } = useTranslation('user');

  return (
    <Column
      spacing={2}
      alignItems="center"
      textAlign="center"
      sx={{ py: 4 }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('sharedHousehold.loadError')}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<ReplayIcon />}
        onClick={onRetry}
        size="small"
      >
        {t('sharedHousehold.retry')}
      </Button>
    </Column>
  );
};

export default SharedHouseholdLoadError;
