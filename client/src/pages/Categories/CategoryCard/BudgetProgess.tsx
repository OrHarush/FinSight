import { Box, LinearProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CurrencyText from '@/components/appCommon/CurrencyText';
import Row from '@/components/layout/Containers/Row';

interface BudgetProgressProps {
  spent: number;
  limit: number;
}

const BudgetProgress = ({ spent, limit }: BudgetProgressProps) => {
  const { t } = useTranslation('categories'); // or 'transactions' if that's where the keys live

  const left = limit - spent;
  const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  const getColor = () => {
    if (progress <= 50) {
      return 'success.main';
    }

    if (progress <= 70) {
      return 'warning.main';
    }

    return 'error.main';
  };

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 5,
          mb: 1,
          '& .MuiLinearProgress-bar': {
            backgroundColor: getColor(),
          },
        }}
      />

      <Row display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary" component="span">
          <CurrencyText value={spent} /> {t('budget.of')} <CurrencyText value={limit} />
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: left < 0 ? 'error.main' : 'success.primary',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {left < 0 ? (
            <>
              {t('budget.overBy')}
              <CurrencyText value={Math.abs(left)} />
            </>
          ) : (
            <>
              <CurrencyText value={left} />
              {t('budget.left')}
            </>
          )}
        </Typography>
      </Row>
    </Box>
  );
};

export default BudgetProgress;
