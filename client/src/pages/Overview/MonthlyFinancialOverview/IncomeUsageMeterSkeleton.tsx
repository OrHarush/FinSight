import { Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const IncomeUsageMeterSkeleton = () => {
  const { t } = useTranslation('overview');

  return (
    <>
      <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
      <Typography variant="caption" color="text.secondary">
        {t('incomeUsageMeter.percentSpent', { percent: '—' })}
      </Typography>
    </>
  );
};

export default IncomeUsageMeterSkeleton;
