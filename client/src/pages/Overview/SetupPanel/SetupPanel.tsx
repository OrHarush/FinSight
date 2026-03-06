import { useTransactions } from '@/hooks/entities/useTransactions';
import { Card, Typography, Button } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import { ROUTES } from '@/constants/Routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const SetupPanel = () => {
  const { t } = useTranslation('overview');
  const navigate = useNavigate();
  const { transactions } = useTransactions();

  const hasTransaction = transactions.length > 0;

  if (hasTransaction) {
    return null;
  }

  return (
    <Column width="100%" minHeight="60vh" justifyContent="center" alignItems="center">
      <Card
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          textAlign: 'center',
        }}
      >
        <Column height={'100%'} spacing={4} alignItems="center">
          <Column spacing={2}>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {t('setup.emptyTitle')}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.75 }}>
              {t('setup.emptyDescription')}
            </Typography>
          </Column>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.TRANSACTIONS_URL)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {t('setup.addFirstTransaction')}
          </Button>
        </Column>
      </Card>
    </Column>
  );
};

export default SetupPanel;
