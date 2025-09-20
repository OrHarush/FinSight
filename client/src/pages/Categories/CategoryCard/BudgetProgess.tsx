import { Box, LinearProgress, Typography } from '@mui/material';
import CurrencyText from '@/components/CurrencyText';
import Row from '@/components/Layout/Row';

interface BudgetProgressProps {
  spent: number;
  limit: number;
}

const BudgetProgress = ({ spent, limit }: BudgetProgressProps) => {
  const left = limit - spent;
  const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  const getColor = () => {
    if (progress <= 50) return 'success.main';
    if (progress <= 70) return 'warning.main';
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
        <Typography variant="body2" color="text.secondary">
          <CurrencyText value={spent} /> of
          <CurrencyText value={limit} />
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: left < 0 ? 'error.main' : 'success.primary', fontWeight: 600 }}
        >
          {left < 0 ? (
            <>
              Over by{' '}
              <CurrencyText
                value={Math.abs(left)}
                sx={{ color: left < 0 ? 'error.main' : 'success.primary', fontWeight: 600 }}
              />
            </>
          ) : (
            <>
              <CurrencyText
                value={left}
                sx={{ color: left < 0 ? 'error.main' : 'success.primary', fontWeight: 600 }}
              />{' '}
              left
            </>
          )}
        </Typography>
      </Row>
    </Box>
  );
};

export default BudgetProgress;
