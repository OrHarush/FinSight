import { Card, Grid, Skeleton, Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { useTranslation } from 'react-i18next';
import IncomeUsageMeterSkeleton from '@/pages/Overview/MonthlyFinancialOverview/IncomeUsageMeterSkeleton';

const MonthlyFinancialOverviewSkeleton = () => {
  const { t } = useTranslation('common');

  return (
    <Grid size={{ xs: 12, md: 6, lg: 5 }}>
      <Card sx={{ p: 3, height: '100%' }}>
        <Row justifyContent={'space-between'} alignItems={'center'} height={'100%'}>
          <Column spacing={2}>
            <Column>
              <Skeleton variant="text" width={100} height={50} />
              <Typography variant="body2" color="text.secondary">
                {t('general.balance')}
              </Typography>
            </Column>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                <Row alignItems="center" spacing={1}>
                  <Skeleton
                    variant="rounded"
                    width={40}
                    height={40}
                    sx={{ borderRadius: '12px', minWidth: 40, minHeight: 40 }}
                  />
                  <Column>
                    <Typography fontWeight={600}>₪—</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('general.income')}
                    </Typography>
                  </Column>
                </Row>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
                <Row alignItems="center" spacing={1}>
                  <Skeleton
                    variant="rounded"
                    width={40}
                    height={40}
                    sx={{ borderRadius: '12px', minWidth: 40, minHeight: 40 }}
                  />
                  <Column>
                    <Typography fontWeight={600}>₪—</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('general.expenses')}
                    </Typography>
                  </Column>
                </Row>
              </Grid>
            </Grid>
          </Column>
          <IncomeUsageMeterSkeleton />
        </Row>
      </Card>
    </Grid>
  );
};

export default MonthlyFinancialOverviewSkeleton;
