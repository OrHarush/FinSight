import { Card, Grid, Typography, Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';
import { useTranslation } from 'react-i18next';

const MonthlyFinancialHealthSkeleton = () => {
  const { t } = useTranslation('overview');

  return (
    <Grid size={{ xs: 12, md: 6, lg: 7 }}>
      <Card sx={{ p: 3, height: '100%', width: '100%' }}>
        <Row width="100%" height="100%" spacing={2} alignItems="center">
          <Skeleton
            variant="rectangular"
            width={80}
            height={80}
            sx={{ minWidth: 80, minHeight: 80, borderRadius: 5 }}
          />
          <Row width="100%" justifyContent="space-evenly" alignItems="center" textAlign="center">
            {[1, 2, 3].map(i => (
              <Column key={i} spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('financialStatusCard.title')}
                </Typography>
                <Skeleton variant="text" width={90} height={28} />
              </Column>
            ))}
          </Row>
        </Row>
      </Card>
    </Grid>
  );
};

export default MonthlyFinancialHealthSkeleton;
