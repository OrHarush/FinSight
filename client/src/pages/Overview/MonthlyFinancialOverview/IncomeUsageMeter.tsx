import { LinearProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface IncomeUsageMeterProps {
  income: number;
  expenses: number;
}

const IncomeUsageMeter = ({ income, expenses }: IncomeUsageMeterProps) => {
  const { t } = useTranslation('overview');
  const usage = income > 0 ? Math.min((expenses / income) * 100, 100) : 0;

  return (
    <>
      <LinearProgress
        variant="determinate"
        value={usage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.08)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor:
              usage < 80 ? 'success.main' : usage < 100 ? 'warning.main' : 'error.main',
          },
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {t('incomeUsageMeter.percentSpent', { percent: usage.toFixed(0) })}
      </Typography>
    </>
  );
};

export default IncomeUsageMeter;
