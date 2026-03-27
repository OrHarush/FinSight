import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const BAR_WIDTHS = ['75%', '40%', '18%'];

const TopCategoriesChartSkeleton = () => {
  const { t } = useTranslation('overview');
  const isMobile = useIsMobile();

  return (
    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', minHeight: 0 }}>
      <Card
        sx={{
          height: '100%',
          width: '100%',
          p: isMobile ? 1 : 2,
          display: 'flex',
          flex: 1,
          minHeight: 0,
        }}
      >
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            '&:last-child': { pb: 2 },
          }}
        >
          <Typography
            variant="h5"
            color="text.primary"
            align={isMobile ? 'center' : undefined}
            sx={{ mb: 2.5, flexShrink: 0 }}
          >
            {t('topSpendingCategories.title')}
          </Typography>
          <Column spacing={3} sx={{ flex: 1, justifyContent: 'center' }}>
            {BAR_WIDTHS.map((width, i) => (
              <Row key={i} spacing={2} alignItems="center">
                <Skeleton variant="text" width={80} height={20} sx={{ flexShrink: 0 }} />
                <Skeleton
                  variant="rounded"
                  height={20}
                  sx={{ width, borderRadius: '0 4px 4px 0', flexShrink: 0 }}
                />
              </Row>
            ))}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TopCategoriesChartSkeleton;
