import { DefaultCategoryKey } from '@finsight/shared';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useCategoryName } from '@/hooks/entities/useCategoryName';

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

interface TooltipPayloadEntry {
  value: number;
  payload: { name: string; amount: number; color: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const theme = useTheme();

  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0];

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        px: 1.5,
        py: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {entry.payload.name}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        ₪{entry.value.toLocaleString()}
      </Typography>
    </Box>
  );
};

const TopCategoriesChart = ({ chartData, isLoading }: TopCategoriesContentProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslation('overview');
  const getCategoryName = useCategoryName();

  const dataset = [...chartData]
    .sort((a, b) => b.amount - a.amount)
    .map(item => ({
      id: item.id,
      name: getCategoryName(item as any),
      amount: item.amount,
      color: item.color ?? theme.palette.grey[500],
    }));

  const chartHeight = dataset.length * 80 + 48;

  return (
    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', minHeight: 0 }}>
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
            position: 'relative',
            '&:last-child': { pb: 2 },
          }}
        >
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2.5, flexShrink: 0 }}>
            {t('topSpendingCategories.title')}
          </Typography>
          <Box
            sx={{
              flex: 1,
              minHeight: chartHeight,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ResponsiveContainer width="100%" height={'100%'}>
              <BarChart
                layout="vertical"
                data={dataset}
                margin={{ top: 4, right: 20, bottom: 4, left: 8 }}
                barSize={20}
              >
                <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  type="number"
                  tickFormatter={(value: number) => `₪${value.toLocaleString()}`}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} activeBar={false}>
                  {dataset.map(entry => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
