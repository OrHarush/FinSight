import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const BAR_WIDTHS = ['85%', '65%', '40%', '15%'];
const AXIS_LABELS = ['₪0', '₪750', '₪1,500', '₪2,250', '₪3,000'];

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
            sx={{ mb: 4, flexShrink: 0, fontWeight: 700 }}
          >
            {t('topSpendingCategories.title')}
          </Typography>

          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', ml: 2 }}
          >
            <Column
              spacing={5}
              sx={{
                flex: 1,
                justifyContent: 'center',
                pb: 1,
              }}
            >
              {BAR_WIDTHS.map((width, i) => (
                <Row key={i} spacing={2} alignItems="center" dir={'ltr'}>
                  <Skeleton
                    variant="rounded"
                    height={24}
                    sx={{
                      width,
                      borderRadius: '0 4px 4px 0',
                      opacity: 0.6 - i * 0.1,
                    }}
                  />
                </Row>
              ))}
            </Column>

            <Row
              justifyContent="space-between"
              sx={{
                pt: 1,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                width: '100%',
                opacity: 0.5,
              }}
            >
              {AXIS_LABELS.map(label => (
                <Typography key={label} variant="caption" sx={{ fontSize: '0.65rem' }}>
                  {label}
                </Typography>
              ))}
            </Row>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TopCategoriesChartSkeleton;
