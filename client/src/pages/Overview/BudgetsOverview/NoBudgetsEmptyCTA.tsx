import SavingsIcon from '@mui/icons-material/Savings';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';

const NoBudgetsEmptyCTA = () => {
  const { t } = useTranslation('overview');
  const navigate = useNavigate();

  return (
    <Column height={'100%'} alignItems="center" justifyContent="center" spacing={2}>
      <SavingsIcon sx={{ fontSize: 48, opacity: 0.6 }} />
      <Typography color="text.secondary">{t('budgetWatch.noBudgets')}</Typography>
      <Button variant="outlined" onClick={() => navigate(ROUTES.BUDGETS_URL)}>
        {t('budgetWatch.addBudgetCTA')}
      </Button>
    </Column>
  );
};

export default NoBudgetsEmptyCTA;
