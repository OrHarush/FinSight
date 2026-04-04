import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const ConfirmStep = () => {
  const { t } = useTranslation('transactions');

  return (
    <Column flex={1} alignItems="center" justifyContent="center">
      <Typography variant="h6" color="text.secondary">
        {t('importWizard.steps.confirm')}
      </Typography>
    </Column>
  );
};

export default ConfirmStep;
