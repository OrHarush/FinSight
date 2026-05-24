import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';

interface AllDuplicatesScreenProps {
  totalCount: number;
  month?: string;
}

const AllDuplicatesScreen = ({ totalCount, month }: AllDuplicatesScreenProps) => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();

  const goToTransactions = () => {
    navigate(month ? `${ROUTES.TRANSACTIONS_URL}?month=${month}` : ROUTES.TRANSACTIONS_URL);
  };

  return (
    <Column flex={1} alignItems="center" justifyContent="center" spacing={3}>
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main' }} />
      <Typography variant="h5" fontWeight={600}>
        {t('importWizard.duplicates.allExist.title')}
      </Typography>
      <Typography color="text.secondary" textAlign="center">
        {t('importWizard.duplicates.allExist.body', { count: totalCount })}
      </Typography>
      <Button variant="contained" onClick={goToTransactions}>
        {t('importWizard.confirm.success.goToTransactions')}
      </Button>
    </Column>
  );
};

export default AllDuplicatesScreen;
