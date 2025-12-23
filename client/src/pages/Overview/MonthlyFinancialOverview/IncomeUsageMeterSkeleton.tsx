import { Box, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const IncomeUsageMeterSkeleton = () => {
  const { t } = useTranslation('overview');

  return (
    <Box sx={{ minWidth: '120px' }}>
      <Typography variant="h5" fontWeight={700}>
        ₪—
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {t('incomeUsageMeter.netThisMonth')}
      </Typography>
      <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
      <Typography variant="caption" color="text.secondary">
        {t('incomeUsageMeter.percentSpent', { percent: '—' })}
      </Typography>
    </Box>
  );
};

export default IncomeUsageMeterSkeleton;
