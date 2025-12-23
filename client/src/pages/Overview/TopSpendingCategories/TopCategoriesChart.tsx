import {
  alpha,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTranslation } from 'react-i18next';

interface TopCategoriesContentProps {
  chartData: {
    id: string;
    name: string;
    amount: number;
    color: string | undefined;
  }[];
  isLoading?: boolean;
}

const TopCategoriesChart = ({ chartData, isLoading }: TopCategoriesContentProps) => {
  const theme = useTheme();
  const { t } = useTranslation('overview');

  const dataset = chartData.map(d => ({
    category: d.name,
    spent: d.amount,
  }));
  const categoryColors: string[] = chartData.map(d =>
    d.color ? alpha(d.color, 0.5) : alpha(theme.palette.grey[500], 0.7)
  );
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ height: '100%', minWidth: '240px', padding: 2 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" color="text.secondary">
            {t('topSpendingCategories.title')}
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: '350px' }}>
            <BarChart
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
