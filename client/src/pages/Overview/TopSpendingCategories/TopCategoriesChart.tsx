import {
  alpha,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTranslation } from 'react-i18next';
import { DefaultCategoryKey } from '../../../../../shared/types/defaultCategories';
import { getCategoryDisplayName } from '@/utils/categoryUtils';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface TopCategoriesContentProps {
  chartData: {
    id: string;
    key?: DefaultCategoryKey;
    name: string;
    amount: number;
    color: string | undefined;
  }[];
  isLoading?: boolean;
}

const TopCategoriesChart = ({ chartData, isLoading }: TopCategoriesContentProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation('overview');
  const { t: tCategories } = useTranslation('categories');

  const dataset = chartData.map(d => ({
    category: getCategoryDisplayName(d, tCategories),
    spent: d.amount,
  }));

  const categoryColors: string[] = chartData.map(d =>
    d.color ? alpha(d.color, 0.5) : alpha(theme.palette.grey[500], 0.7)
  );
  return (
    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', minHeight: 0 }}>
      <Card sx={{ height: '100%', minHeight: { xs: 320, sm: 360, md: 0 }, flex: 1, display: 'flex' }}>
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            position: 'relative',
            p: 2,
            '&:last-child': {
              pb: 2,
            },
          }}
        >
          <Typography variant="h5" color="text.secondary">
            {t('topSpendingCategories.title')}
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: { xs: 240, sm: 280, md: 0 } }}>
            <BarChart
              key={isMobile ? 'mobile-chart' : isTablet ? 'tablet-chart' : 'desktop-chart'}
              height={isMobile ? 240 : isTablet ? 220 : 200}
              layout="horizontal"
              dataset={dataset}
              borderRadius={8}
              series={[
                {
                  dataKey: 'spent',
                },
              ]}
              yAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'category',
                  colorMap: {
                    type: 'ordinal',
                    colors: categoryColors,
                  },
                  barGapRatio: 0.5,
                  categoryGapRatio: 0.4,
                },
              ]}
              xAxis={[
                {
                  valueFormatter: (value: number) => `₪${value.toLocaleString()}`,
                },
              ]}
            />
          </Box>
          {isLoading && (
            <Fade in={isLoading}>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(2px)',
                  bgcolor: 'rgba(0,0,0,0.15)',
                  borderRadius: 2,
                }}
              >
                <CircularProgress size={36} thickness={4} />
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TopCategoriesChart;
